"""Application configuration using Pydantic Settings with optional Secret Manager support."""

import json
import os
from functools import lru_cache
from typing import Optional

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables and optional Secret Manager."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # FRONTEND_URL is set by the deployment platform (Vercel/Render).
    FRONTEND_URL: str = Field(default="http://localhost:5173")
    PORT: int = Field(default=8000)
    APP_ENV: str = Field(default="development")
    DEBUG: bool = Field(default=True)
    API_PREFIX: str = Field(default="/api/v1")

    # Firebase
    FIREBASE_PROJECT_ID: str = Field(default="plant-co2-farm")
    GCP_PROJECT_ID: str = Field(default="plant-co2-farm")
    FIREBASE_SERVICE_ACCOUNT: Optional[str] = Field(default=None)
    FIREBASE_SERVICE_ACCOUNT_PATH: Optional[str] = Field(default=None)

    # JWT
    JWT_SECRET_KEY: str = Field(default="your-32-char-random-secret-here")
    JWT_ALGORITHM: str = Field(default="HS256")
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=15)
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = Field(default=30)

    # Gemini API
    GEMINI_API_KEY: str = Field(default="")
    GEMINI_MODEL: str = Field(default="gemini-1.5-flash")

    # Razorpay (Test Mode)
    RAZORPAY_KEY_ID: str = Field(default="")
    RAZORPAY_KEY_SECRET: str = Field(default="")
    RAZORPAY_WEBHOOK_SECRET: str = Field(default="")

    # SendGrid (optional)
    SENDGRID_API_KEY: str = Field(default="")
    SENDGRID_FROM_EMAIL: str = Field(default="orders@plant-co2-farm.com")

    # Pricing Constants
    PLATFORM_SERVICE_FEE_RATE: float = Field(default=0.05)
    GATEWAY_FEE_RATE: float = Field(default=0.02)
    GATEWAY_GST_RATE: float = Field(default=0.18)
    PRODUCT_GST_RATE: float = Field(default=0.00)
    STANDARD_DELIVERY_FEE_PAISE: int = Field(default=13000)
    EXPRESS_DELIVERY_FEE_PAISE: int = Field(default=30000)

    # Secret Manager client placeholder
    _secret_client: Optional[object] = None

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._load_secrets_from_manager()

    def _load_secrets_from_manager(self) -> None:
        """Load secrets from Google Cloud Secret Manager if client is available in production."""
        if self.APP_ENV == "production" and self.GCP_PROJECT_ID:
            try:
                from google.cloud import secretmanager
                self._secret_client = secretmanager.SecretManagerServiceClient()
                self._load_secret("firebase-service-account", "FIREBASE_SERVICE_ACCOUNT")
                self._load_secret("gemini-api-key", "GEMINI_API_KEY")
                self._load_secret("razorpay-key-id", "RAZORPAY_KEY_ID")
                self._load_secret("razorpay-key-secret", "RAZORPAY_KEY_SECRET")
                self._load_secret("razorpay-webhook-secret", "RAZORPAY_WEBHOOK_SECRET")
                self._load_secret("jwt-secret", "JWT_SECRET_KEY")
                self._load_secret("sendgrid-api-key", "SENDGRID_API_KEY")
            except Exception as e:
                print(f"Note: Google Secret Manager not available or skipped: {e}")

    def _load_secret(self, secret_id: str, attr_name: str) -> None:
        """Load a single secret from Secret Manager if enabled."""
        if not self._secret_client:
            return
        try:
            name = f"projects/{self.GCP_PROJECT_ID}/secrets/{secret_id}/versions/latest"
            response = self._secret_client.access_secret_version(request={"name": name})
            secret_value = response.payload.data.decode("UTF-8")
            setattr(self, attr_name, secret_value)
        except Exception as e:
            print(f"Warning: Failed to load secret {secret_id}: {e}")

    @property
    def firebase_service_account_dict(self) -> dict:
        """Parse Firebase service account from JSON file or JSON string."""
        if self.FIREBASE_SERVICE_ACCOUNT_PATH and os.path.exists(self.FIREBASE_SERVICE_ACCOUNT_PATH):
            with open(self.FIREBASE_SERVICE_ACCOUNT_PATH, "r") as f:
                return json.load(f)
        
        if self.FIREBASE_SERVICE_ACCOUNT:
            sa_json = self.FIREBASE_SERVICE_ACCOUNT
            if "\\n" in sa_json:
                sa_json = sa_json.replace("\\n", "\n")
            return json.loads(sa_json)
        
        return {}


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
