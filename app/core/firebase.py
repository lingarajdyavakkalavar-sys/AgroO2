"""Firebase initialization module with graceful optional fallback."""
import os
from app.core.config import get_settings

_db = None

def init_firebase():
    global _db
    try:
        import firebase_admin
        from firebase_admin import credentials, firestore
        if not firebase_admin._apps:
            settings = get_settings()
            sa_dict = settings.firebase_service_account_dict
            if sa_dict:
                cred = credentials.Certificate(sa_dict)
                firebase_admin.initialize_app(cred, {'projectId': settings.FIREBASE_PROJECT_ID})
            else:
                firebase_admin.initialize_app(options={'projectId': settings.FIREBASE_PROJECT_ID})
        _db = firestore.client()
    except Exception as e:
        print(f"Firebase/Firestore initialization note: {e}")
        _db = None
    return _db

def get_db():
    global _db
    if _db is None:
        init_firebase()
    return _db
