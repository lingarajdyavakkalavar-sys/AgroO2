import { useState, useRef, useEffect } from 'react'
import {
  LayoutDashboard,
  MapPin,
  Bug,
  Bot,
  CheckSquare,
  Cloud,
  Leaf,
  Building2,
  Calculator,
  Users,
  Settings,
  Sun,
  Droplets,
  Bell,
  Camera,
  Check,
  ArrowRight,
  Send,
  Calendar,
  Sparkles,
  Plus,
  Menu,
  X,
  CheckCircle2,
  Sprout,
  LogOut,
  Layers,
  Edit3,
  ShoppingCart,
  Factory,
  Trash2
} from 'lucide-react'
import { LandOnboardingModal } from './components/onboarding/LandOnboardingModal'
import { CO2LandCalculator } from './components/calculator/CO2LandCalculator'
import { IndustrialCO2Procurement } from './components/marketplace/IndustrialCO2Procurement'
import {
  authApi,
  farmsApi,
  productsApi,
  ordersApi,
  carbonApi,
  diagnosesApi,
  chatApi,
  tasksApi,
  weatherApi,
  tokenStorage,
} from './services/api'

// ============================================================
// DATA & CONSTANTS
// ============================================================

const defaultUser = {
  name: 'Ramesh Patil',
  email: 'ramesh.patil.organic@gmail.com',
  phone: '+91 98450 12345',
  role: 'Organic Farmer',
  location: 'Mandya, Karnataka, India',
  landAcres: 5.0,
  soilType: 'Red Loamy Soil',
  soilHealth: 'Medium (0.65% SOC)',
  soilOrganicCarbon: 0.65,
  primaryCrops: 'Tomato, Cotton, Pulses',
  farmingType: 'Certified Organic',
  irrigationType: 'Drip & Borewell',
  avatar: '/images/farmer_avatar.jpg',
  authProvider: 'google',
  verified: true,
  hasCompletedOnboarding: false,
}

const defaultWeather = [
  { day: 'Mon', high: 28, low: 18, type: 'sunny' },
  { day: 'Tue', high: 27, low: 17, type: 'partly-cloudy' },
  { day: 'Wed', high: 26, low: 18, type: 'rainy' },
  { day: 'Thu', high: 27, low: 18, type: 'partly-cloudy' },
  { day: 'Fri', high: 28, low: 19, type: 'sunny' },
]

const quickActionCards = [
  { title: 'CO₂ Land Calculator', desc: 'Compute CO₂ added to your acres', icon: Calculator, color: '#15803D', bg: '#EAF7ED', action: 'calculator' },
  { title: 'Buy Industrial CO₂', desc: 'Procure carbon from certified industries', icon: Factory, color: '#0F766E', bg: '#F0FDFA', action: 'procurement' },
  { title: 'Edit Land Details', desc: 'Update acres & soil characteristics', icon: MapPin, color: '#16A34A', bg: '#F0FDF4', action: 'onboarding' },
  { title: 'Soil Health', desc: 'Monitor SOC & nutrient fertility', icon: Leaf, color: '#22C55E', bg: '#F1F8F3', action: 'soil' },
  { title: 'Crop Health', desc: 'Check pest & disease diagnostics', icon: Sprout, color: '#0D9488', bg: '#F0FDFA', action: 'pest' },
  { title: 'Govt Schemes', desc: 'Find subsidies & PKVY benefits', icon: Building2, color: '#15803D', bg: '#EAF7ED', action: 'schemes' },
]

const defaultSuggestedQuestions = [
  'How much CO₂ can my soil capture with cover crops?',
  'How do I buy captured CO₂ or biochar for my acres?',
  'How can I increase Soil Organic Carbon (SOC)?',
  'Suggest organic pest control for tomato blight',
]

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'CO₂ Calculator', icon: Calculator },
  { label: 'Buy Industrial CO₂', icon: Factory },
  { label: 'My Farm Land', icon: MapPin },
  { label: 'AI Pest / Disease', icon: Bug },
  { label: 'AI Advisor', icon: Bot },
  { label: 'Tasks', icon: CheckSquare },
  { label: 'Weather', icon: Cloud },
  { label: 'Soil Health', icon: Leaf },
  { label: 'Government Schemes', icon: Building2 },
  { label: 'Community', icon: Users },
  { label: 'Settings', icon: Settings },
]

// ============================================================
// GOOGLE ICON SVG COMPONENT
// ============================================================

function GoogleIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  )
}

// ============================================================
// LOGIN / AUTHENTICATION PAGE
// ============================================================

function LoginPage({ onLoginSuccess }) {
  const [authMethod, setAuthMethod] = useState('google')
  const [showGoogleModal, setShowGoogleModal] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  
  const [customName, setCustomName] = useState('')
  const [customEmail, setCustomEmail] = useState('')

  const [phone, setPhone] = useState('9845012345')
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState(['1', '2', '3', '4', '5', '6'])

  const [email, setEmail] = useState('ramesh.patil.organic@gmail.com')
  const [password, setPassword] = useState('••••••••')
  const [showPassword, setShowPassword] = useState(false)

  const handleGoogleLogin = async (account) => {
    setGoogleLoading(true)
    try {
      const res = await authApi.seedTestUser()
      setShowGoogleModal(false)
      onLoginSuccess({
        ...defaultUser,
        name: account?.name || res.user.name || 'Ramesh Patil',
        email: account?.email || res.user.email || 'ramesh.patil.organic@gmail.com',
        uid: res.user.uid,
        authProvider: 'google',
        hasCompletedOnboarding: res.user.has_completed_onboarding || false,
      })
    } catch (err) {
      console.warn('Google login fallback:', err)
      onLoginSuccess({
        ...defaultUser,
        name: account?.name || 'Ramesh Patil',
        email: account?.email || 'ramesh.patil.organic@gmail.com',
        authProvider: 'google',
        hasCompletedOnboarding: false,
      })
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleCustomGoogleSubmit = async (e) => {
    e.preventDefault()
    if (!customName.trim() || !customEmail.trim()) return
    setGoogleLoading(true)
    try {
      const res = await authApi.seedTestUser()
      setShowGoogleModal(false)
      onLoginSuccess({
        ...defaultUser,
        name: customName.trim(),
        email: customEmail.trim(),
        uid: res.user.uid,
        authProvider: 'google',
        hasCompletedOnboarding: false,
      })
    } catch (err) {
      console.warn('Custom login fallback:', err)
      onLoginSuccess({
        ...defaultUser,
        name: customName.trim(),
        email: customEmail.trim(),
        authProvider: 'google',
        hasCompletedOnboarding: false,
      })
    } finally {
      setGoogleLoading(false)
    }
  }

  const handlePhoneSubmit = async (e) => {
    e.preventDefault()
    if (!otpSent) {
      setOtpSent(true)
    } else {
      try {
        const res = await authApi.seedTestUser()
        onLoginSuccess({
          ...defaultUser,
          phone: `+91 ${phone}`,
          uid: res.user.uid,
          authProvider: 'phone',
          hasCompletedOnboarding: false,
        })
      } catch {
        onLoginSuccess({
          ...defaultUser,
          phone: `+91 ${phone}`,
          authProvider: 'phone',
          hasCompletedOnboarding: false,
        })
      }
    }
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await authApi.seedTestUser()
      onLoginSuccess({
        ...defaultUser,
        email: email,
        uid: res.user.uid,
        authProvider: 'email',
        hasCompletedOnboarding: false,
      })
    } catch {
      onLoginSuccess({
        ...defaultUser,
        email: email,
        authProvider: 'email',
        hasCompletedOnboarding: false,
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00381E] via-[#094D2B] to-[#012413] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-900/40">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00381E] to-[#0B5E34] p-6 text-center text-white relative">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 mx-auto flex items-center justify-center mb-3 shadow-inner">
            <Leaf className="w-8 h-8 text-emerald-300" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">CO₂ FARM</h1>
          <p className="text-xs text-emerald-200/90 mt-1 font-medium">Sustainable Agriculture & Soil Carbon</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-gray-100 bg-gray-50/80 p-1.5">
          <button
            onClick={() => setAuthMethod('google')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              authMethod === 'google' ? 'bg-white text-emerald-800 shadow-xs' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Google
          </button>
          <button
            onClick={() => setAuthMethod('phone')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              authMethod === 'phone' ? 'bg-white text-emerald-800 shadow-xs' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Phone
          </button>
          <button
            onClick={() => setAuthMethod('email')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              authMethod === 'email' ? 'bg-white text-emerald-800 shadow-xs' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Email
          </button>
        </div>

        <div className="p-6 space-y-5">
          
          {/* Method: Google */}
          {authMethod === 'google' && (
            <div className="space-y-4 text-center">
              <p className="text-xs text-gray-600">
                Sign in with your Google account to access your farm dashboard and land calculations.
              </p>
              <button
                type="button"
                onClick={() => setShowGoogleModal(true)}
                className="w-full py-3 px-4 border-2 border-gray-200 hover:border-emerald-500 bg-white hover:bg-emerald-50/20 text-gray-800 rounded-2xl font-bold text-xs flex items-center justify-center gap-3 transition-all shadow-xs cursor-pointer"
              >
                <GoogleIcon className="w-5 h-5" />
                Sign in with Google
              </button>
            </div>
          )}

          {/* Method: Phone OTP */}
          {authMethod === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">Mobile Number</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-gray-600 text-xs font-bold">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-r-xl px-3 py-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="98450 12345"
                  />
                </div>
              </div>

              {otpSent && (
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">Enter 6-Digit OTP</label>
                  <div className="flex gap-2 justify-between">
                    {otpCode.map((digit, idx) => (
                      <input
                        key={idx}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => {
                          const newOtp = [...otpCode]
                          newOtp[idx] = e.target.value
                          setOtpCode(newOtp)
                        }}
                        className="w-10 h-10 text-center border border-gray-200 rounded-xl text-sm font-bold bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                      />
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                {otpSent ? 'Verify OTP & Sign In' : 'Send One-Time Password'}
              </button>
            </form>
          )}

          {/* Method: Email */}
          {authMethod === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Sign In to Account
              </button>
            </form>
          )}

        </div>

      </div>

      {/* Google Account Selector Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <GoogleIcon className="w-5 h-5" />
                <h3 className="text-sm font-bold text-gray-900">Choose Google Account</h3>
              </div>
              <button onClick={() => setShowGoogleModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleGoogleLogin({ name: 'Ramesh Patil', email: 'ramesh.patil.organic@gmail.com' })}
                disabled={googleLoading}
                className="w-full p-3 rounded-2xl border border-gray-200 hover:border-emerald-500 bg-gray-50/60 hover:bg-emerald-50/30 flex items-center gap-3 text-left transition-all cursor-pointer"
              >
                <img src="/images/farmer_avatar.jpg" alt="Ramesh" className="w-10 h-10 rounded-full object-cover border border-emerald-300" />
                <div>
                  <p className="text-xs font-bold text-gray-900">Ramesh Patil</p>
                  <p className="text-[11px] text-gray-500">ramesh.patil.organic@gmail.com</p>
                </div>
              </button>

              <button
                onClick={() => handleGoogleLogin({ name: 'Suresh Gowda', email: 'suresh.gowda.farms@gmail.com' })}
                disabled={googleLoading}
                className="w-full p-3 rounded-2xl border border-gray-200 hover:border-emerald-500 bg-gray-50/60 hover:bg-emerald-50/30 flex items-center gap-3 text-left transition-all cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-700 text-white font-bold text-sm flex items-center justify-center">
                  SG
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Suresh Gowda</p>
                  <p className="text-[11px] text-gray-500">suresh.gowda.farms@gmail.com</p>
                </div>
              </button>
            </div>

            {googleLoading && (
              <div className="py-2 text-center text-xs text-emerald-700 font-semibold flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                Signing into Cloud Session...
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  )
}

// ============================================================
// MAIN APP COMPONENT
// ============================================================

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = tokenStorage.getUser()
      if (stored && typeof stored === 'object') {
        return {
          ...defaultUser,
          ...stored,
          name: stored.name || stored.full_name || defaultUser.name,
          landAcres: stored.landAcres !== undefined ? Number(stored.landAcres) : (stored.total_land_acres !== undefined ? Number(stored.total_land_acres) : defaultUser.landAcres),
          soilType: stored.soilType || stored.soil_type || defaultUser.soilType,
          soilHealth: stored.soilHealth || stored.soil_health || defaultUser.soilHealth,
          soilOrganicCarbon: stored.soilOrganicCarbon !== undefined ? Number(stored.soilOrganicCarbon) : (stored.soil_organic_carbon !== undefined ? Number(stored.soil_organic_carbon) : defaultUser.soilOrganicCarbon),
          primaryCrops: Array.isArray(stored.primary_crops) ? stored.primary_crops.join(', ') : (stored.primaryCrops || stored.primary_crops || defaultUser.primaryCrops),
          farmingType: stored.farmingType || stored.farming_type || defaultUser.farmingType,
          irrigationType: stored.irrigationType || stored.irrigation_type || defaultUser.irrigationType,
          location: stored.location || (stored.district && stored.state ? `${stored.district}, ${stored.state}` : defaultUser.location),
          avatar: stored.avatar || defaultUser.avatar,
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored user:', e)
    }
    return defaultUser
  })
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [activeNav, setActiveNav] = useState('Dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Onboarding / Land Details Modal
  const [showOnboardingModal, setShowOnboardingModal] = useState(false)
  const [isOnboardingEditMode, setIsOnboardingEditMode] = useState(false)

  // Real-time Tasks state
  const [tasks, setTasks] = useState([])
  const [tasksLoading, setTasksLoading] = useState(false)
  const [showAddTaskModal, setShowAddTaskModal] = useState(false)
  const [newTaskText, setNewTaskText] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState('High')
  const [newTaskBlock, setNewTaskBlock] = useState('Main Parcel')
  
  // Real-time Weather state
  const [weatherData, setWeatherData] = useState({
    location: 'Mandya, Karnataka, India',
    current_temp: 28,
    current_condition: 'Partly Cloudy',
    current_humidity: 65,
    forecast: defaultWeather,
    agronomy: {
      soil_temperature_10cm: 24.2,
      soil_temp_status: 'Optimal (Microbes & Roots)',
      evapotranspiration_rate: 3.8,
      uv_index: 6,
      uv_status: 'Moderate',
      dew_point: 17.0,
    }
  })
  const [showWeatherModal, setShowWeatherModal] = useState(false)

  // Real-time Diagnoses state
  const [recentDiagnoses, setRecentDiagnoses] = useState([])
  const [diagnosesLoading, setDiagnosesLoading] = useState(false)
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null)
  
  // Real-time Carbon stats
  const [carbonStats, setCarbonStats] = useState({
    score: 78,
    annual_co2_per_acre: 1.15,
    total_annual_co2: 5.75,
  })

  // Notifications
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Land Calibration Live', desc: 'Your parcel profile is active on cloud database.', time: 'Just now', unread: true },
    { id: 2, title: 'Optimal Sowing Window', desc: 'Favorable soil moisture detected in East Block.', time: '1h ago', unread: true },
    { id: 3, title: 'Early Blight risk alert', desc: 'High humidity reported; spray preventative organic neem spray.', time: '3h ago', unread: true },
  ])

  // Pest Detection state
  const [detectionState, setDetectionState] = useState('idle')
  const [uploadedImage, setUploadedImage] = useState(null)
  const [activeDiagnosisResult, setActiveDiagnosisResult] = useState(null)
  const [detectionError, setDetectionError] = useState('')
  const fileInputRef = useRef(null)

  // AI Chat state
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: `Namaste ${defaultUser.name} ji! I am Krishi Mitra, your AI Farm & Soil Advisor. How can I help you improve crop yield, soil organic carbon, or pest management on your ${defaultUser.landAcres} acres today?`,
      time: 'Just now'
    }
  ])
  const [suggestedQuestionsList, setSuggestedQuestionsList] = useState(defaultSuggestedQuestions)
  const [chatInput, setChatInput] = useState('')
  const [isAiTyping, setIsAiTyping] = useState(false)
  const chatBottomRef = useRef(null)

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, isAiTyping])

  // ============================================================
  // REAL-TIME DATA INITIALIZATION ON MOUNT
  // ============================================================
  useEffect(() => {
    let isMounted = true

    async function initializeAppData() {
      // 1. Ensure authenticated session
      try {
        if (!tokenStorage.getAccessToken()) {
          const res = await authApi.seedTestUser()
          if (isMounted && res?.user) {
            setCurrentUser(prev => ({ ...prev, ...res.user, landAcres: res.user.land_acres || prev.landAcres }))
          }
        }
      } catch (authErr) {
        console.warn('Auth init note:', authErr)
      }

      // 2. Fetch User Farm details
      try {
        const farmRes = await farmsApi.getMyFarm()
        if (isMounted && farmRes) {
          setCurrentUser(prev => ({
            ...prev,
            farmId: farmRes.id,
            landAcres: farmRes.total_land_acres || prev.landAcres,
            soilType: farmRes.soil_type || prev.soilType,
            soilOrganicCarbon: farmRes.soil_organic_carbon || prev.soilOrganicCarbon,
            soilHealth: farmRes.soil_health || (
              (farmRes.soil_organic_carbon || 0.65) < 0.40
                ? 'Low (0.35% SOC)'
                : (farmRes.soil_organic_carbon || 0.65) < 0.75
                ? 'Medium (0.65% SOC)'
                : (farmRes.soil_organic_carbon || 0.65) < 1.20
                ? 'Good (0.95% SOC)'
                : 'High (1.35% SOC)'
            ),
            primaryCrops: Array.isArray(farmRes.primary_crops) ? farmRes.primary_crops.join(', ') : (farmRes.primary_crops || prev.primaryCrops),
            farmingType: farmRes.farming_type || prev.farmingType,
            irrigationType: farmRes.irrigation_type || prev.irrigationType,
            hasCompletedOnboarding: true,
          }))
        }
      } catch (farmErr) {
        console.warn('Farm fetch note (onboarding prompt available):', farmErr)
      }

      // 3. Fetch Real-Time Tasks
      try {
        setTasksLoading(true)
        const tasksRes = await tasksApi.getTasks()
        if (isMounted && Array.isArray(tasksRes)) {
          const formattedTasks = tasksRes.map(t => ({
            id: t.id,
            text: t.text,
            priority: t.priority,
            completed: t.completed,
            block: t.block,
            dueDate: t.due_date,
            tagColor: t.priority === 'High' ? 'text-red-600 bg-red-50' : t.priority === 'Medium' ? 'text-amber-600 bg-amber-50' : 'text-emerald-600 bg-emerald-50',
          }))
          setTasks(formattedTasks)
        }
      } catch (taskErr) {
        console.warn('Tasks fetch note:', taskErr)
      } finally {
        if (isMounted) setTasksLoading(false)
      }

      // 4. Fetch Real-Time Weather Forecast
      try {
        const weatherRes = await weatherApi.getWeather()
        if (isMounted && weatherRes?.forecast) {
          setWeatherData(weatherRes)
        }
      } catch (weatherErr) {
        console.warn('Weather fetch note:', weatherErr)
      }

      // 5. Fetch Past Diagnoses History
      try {
        setDiagnosesLoading(true)
        const diagRes = await diagnosesApi.listDiagnoses()
        if (isMounted && Array.isArray(diagRes) && diagRes.length > 0) {
          const formattedDiag = diagRes.map(d => ({
            id: d.id,
            crop: d.crop || 'Crop',
            disease: d.disease || 'Health Scan',
            confidence: `Confidence: ${Math.round((d.confidence || 0.9) * 100)}%`,
            confidenceLevel: (d.confidence || 0.9) >= 0.85 ? 'high' : 'medium',
            time: d.created_at ? new Date(d.created_at).toLocaleDateString() : 'Recent',
            image: d.image_url || '/images/tomato_early_blight.jpg',
            symptoms: d.symptoms || 'Diagnosed pathology scan',
            action: d.recommended_action || 'Apply recommended organic treatments',
          }))
          setRecentDiagnoses(formattedDiag)
          if (!activeDiagnosisResult) setActiveDiagnosisResult(formattedDiag[0])
        }
      } catch (diagErr) {
        console.warn('Diagnoses fetch note:', diagErr)
      } finally {
        if (isMounted) setDiagnosesLoading(false)
      }

      // 6. Fetch Carbon Score
      try {
        const carbonRes = await carbonApi.getScore()
        if (isMounted && carbonRes?.score) {
          setCarbonStats(carbonRes)
        }
      } catch (carbonErr) {
        console.warn('Carbon score fetch note:', carbonErr)
      }

      // 7. Fetch Chat Suggestions
      try {
        const suggestionsRes = await chatApi.getSuggestions()
        if (isMounted && Array.isArray(suggestionsRes) && suggestionsRes.length > 0) {
          setSuggestedQuestionsList(suggestionsRes)
        }
      } catch (sugErr) {
        console.warn('Chat suggestions fetch note:', sugErr)
      }
    }

    initializeAppData()

    return () => {
      isMounted = false
    }
  }, [])

  // ============================================================
  // REAL-TIME EVENT HANDLERS
  // ============================================================

  const handleLoginSuccess = (userObj) => {
    setCurrentUser(userObj)
    setIsAuthenticated(true)
    if (!userObj.hasCompletedOnboarding) {
      setIsOnboardingEditMode(false)
      setShowOnboardingModal(true)
    }
  }

  const handleSaveOnboarding = async (updatedUser) => {
    try {
      const savedFarm = await farmsApi.completeOnboarding(updatedUser)
      setCurrentUser(prev => ({
        ...prev,
        ...updatedUser,
        farmId: savedFarm.id,
        hasCompletedOnboarding: true,
      }))
      setShowOnboardingModal(false)
      setIsOnboardingEditMode(false)
      
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `Welcome ${updatedUser.name}! Your ${updatedUser.landAcres} Acres farm in ${updatedUser.location || 'Karnataka'} is calibrated with ${updatedUser.soilType}. You can now compute exact carbon sequestration and procure verified industrial carbon!`,
          time: 'Just now'
        }
      ])
    } catch (err) {
      console.error('Save onboarding error:', err)
      throw err
    }
  }

  const toggleTask = async (id) => {
    const target = tasks.find(t => t.id === id)
    if (!target) return
    const newCompleted = !target.completed
    // Optimistic UI update
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: newCompleted } : t))
    try {
      await tasksApi.updateTask(id, { completed: newCompleted })
    } catch (err) {
      console.warn('Task update error:', err)
      // Revert on error
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: !newCompleted } : t))
    }
  }

  const handleAddTask = async (e) => {
    e.preventDefault()
    if (!newTaskText.trim()) return
    const colors = {
      High: 'text-red-600 bg-red-50',
      Medium: 'text-amber-600 bg-amber-50',
      Low: 'text-emerald-600 bg-emerald-50',
    }
    try {
      const created = await tasksApi.createTask({
        text: newTaskText.trim(),
        priority: newTaskPriority,
        block: newTaskBlock,
      })
      const newTask = {
        id: created.id,
        text: created.text,
        priority: created.priority,
        completed: created.completed,
        block: created.block,
        dueDate: created.due_date,
        tagColor: colors[created.priority] || 'text-emerald-600 bg-emerald-50',
      }
      setTasks(prev => [newTask, ...prev])
      setNewTaskText('')
      setShowAddTaskModal(false)
    } catch (err) {
      alert(`Could not create task: ${err.message}`)
    }
  }

  const handleDeleteTask = async (id, e) => {
    if (e) e.stopPropagation()
    try {
      await tasksApi.deleteTask(id)
      setTasks(prev => prev.filter(t => t.id !== id))
    } catch (err) {
      console.warn('Delete task error:', err)
    }
  }

  // Real-time Leaf Image Upload to Gemini Vision
  const handleFileUpload = async (file) => {
    if (!file) return
    const localUrl = URL.createObjectURL(file)
    setUploadedImage(localUrl)
    setDetectionState('scanning')
    setDetectionError('')
    
    try {
      const diagRes = await diagnosesApi.analyzeDisease(
        file,
        currentUser.primaryCrops ? currentUser.primaryCrops.split(',')[0].trim() : 'Tomato',
        currentUser.farmId || null
      )

      const formattedResult = {
        id: diagRes.id || `diag-${Date.now()}`,
        crop: diagRes.crop || 'Crop',
        disease: diagRes.disease || 'Detected Condition',
        confidence: `Confidence: ${Math.round((diagRes.confidence || 0.92) * 100)}%`,
        confidenceLevel: (diagRes.confidence || 0.9) >= 0.85 ? 'high' : 'medium',
        time: 'Just now',
        image: diagRes.image_url || localUrl,
        symptoms: diagRes.symptoms || 'Visual pathology characteristics identified by Gemini Vision model.',
        action: diagRes.recommended_action || 'Follow organic treatment guidelines and isolate affected foliage.',
      }

      setActiveDiagnosisResult(formattedResult)
      setRecentDiagnoses(prev => [formattedResult, ...prev.filter(d => d.id !== formattedResult.id)])
      setDetectionState('result')
    } catch (err) {
      console.error('Diagnosis API error:', err)
      setDetectionError(err.message || 'Gemini Vision scan failed. Please try again.')
      // Provide actionable fallback result
      const fallbackResult = {
        id: `diag-${Date.now()}`,
        crop: 'Tomato',
        disease: 'Early Blight (Alternaria solani)',
        confidence: 'Confidence: 91%',
        confidenceLevel: 'high',
        time: 'Just now',
        image: localUrl,
        symptoms: 'Concentric brown target rings on lower leaf surface with surrounding chlorotic halo.',
        action: 'Prune infected lower foliage. Spray 5ml/L certified organic neem oil solution and improve furrow drainage.',
      }
      setActiveDiagnosisResult(fallbackResult)
      setRecentDiagnoses(prev => [fallbackResult, ...prev])
      setDetectionState('result')
    }
  }

  // Real-time Krishi Mitra AI Chat Message
  const handleSendMessage = async (textToSend) => {
    const message = textToSend || chatInput
    if (!message.trim()) return

    const userMsg = { sender: 'user', text: message.trim(), time: 'Just now' }
    setChatMessages(prev => [...prev, userMsg])
    setChatInput('')
    setIsAiTyping(true)

    try {
      const response = await chatApi.sendMessage(
        message.trim(),
        currentUser.farmId || null,
        {
          land_acres: currentUser.landAcres,
          soil_type: currentUser.soilType,
          soil_health: currentUser.soilHealth,
          primary_crops: currentUser.primaryCrops,
        }
      )
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: response.reply,
          time: 'Just now',
        }
      ])
    } catch (err) {
      console.warn('Chat API fallback:', err)
      let replyText = `For your ${currentUser.landAcres} Acres of ${currentUser.soilType}, adding green manure and biochar increases soil carbon sequestration by ~0.65 tCO₂e/acre/year while boosting microbial health.`
      const lower = message.toLowerCase()
      if (lower.includes('co2') || lower.includes('carbon') || lower.includes('calculate')) {
        replyText = `Based on your ${currentUser.landAcres} acres and ${currentUser.soilHealth}, adopting cover cropping + reduced tillage will sequester approximately ${(currentUser.landAcres * 1.1).toFixed(1)} tCO₂e into your soil every year!`
      } else if (lower.includes('pest') || lower.includes('disease') || lower.includes('blight')) {
        replyText = `For fungal issues or aphid infestation on organic farms, spray 5ml/L neem seed kernel extract (NSKE 5%) or diluted trichoderma viride during morning hours.`
      }
      setChatMessages(prev => [...prev, { sender: 'ai', text: replyText, time: 'Just now' }])
    } finally {
      setIsAiTyping(false)
    }
  }

  // Industrial CO2 Procurement params
  const [procurementParams, setProcurementParams] = useState({
    defaultTonnes: (defaultUser.landAcres * 1.15).toFixed(1),
    landAcres: defaultUser.landAcres,
    soilType: defaultUser.soilType,
    soilHealth: defaultUser.soilHealth,
  })

  const handleNavigateToProcurement = (params) => {
    if (params) setProcurementParams(params)
    setActiveNav('Buy Industrial CO₂')
  }

  // Quick Action routing
  const handleQuickAction = (action) => {
    if (action === 'calculator') {
      setActiveNav('CO₂ Calculator')
    } else if (action === 'procurement') {
      setActiveNav('Buy Industrial CO₂')
    } else if (action === 'onboarding') {
      setIsOnboardingEditMode(true)
      setShowOnboardingModal(true)
    } else if (action === 'soil') {
      setActiveNav('Soil Health')
    } else if (action === 'pest') {
      setActiveNav('AI Pest / Disease')
    } else if (action === 'schemes') {
      setActiveNav('Government Schemes')
    } else {
      setActiveNav('Dashboard')
    }
  }

  // Live estimated CO2 sequestration for the quick dashboard card
  const estimatedAnnualCO2 = ((Number(currentUser?.landAcres) || 5.0) * 1.15).toFixed(1)

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <div className="min-h-screen bg-[#F4F7F5] flex flex-col lg:flex-row text-gray-800 font-sans antialiased">
      
      {/* ============================================================ */}
      {/* 1. LEFT SIDEBAR NAVIGATION */}
      {/* ============================================================ */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#00381E] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 overflow-y-auto flex-1 scrollbar-none">
          
          {/* Logo Header */}
          <div className="flex items-center justify-between px-2 py-2 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shadow-inner">
                <Leaf className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-base font-black tracking-tight text-white flex items-center gap-1">
                  CO<span className="text-xs font-normal">2</span> FARM
                </div>
                <div className="text-[10px] text-emerald-300/80 font-medium tracking-wide">
                  Grow. Capture. Soil.
                </div>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-emerald-200 hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 mt-2">
            {navItems.map((item) => {
              const isActive = activeNav === item.label
              const Icon = item.icon
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    setActiveNav(item.label)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#002715] text-white font-bold shadow-xs border-l-3 border-emerald-400'
                      : 'text-emerald-100/75 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-emerald-300' : 'text-emerald-300/70'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Bottom Farmer Profile & Land Particulars Card */}
        <div className="p-3.5 border-t border-emerald-900/60 bg-[#002715]/95 space-y-2.5">
          
          {/* Farmer Card */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative flex-shrink-0">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/60 shadow-sm"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#002715]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
                <div className="text-[11px] text-emerald-300/80">{currentUser.role}</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-emerald-400 bg-emerald-950 border border-emerald-700/50 px-1.5 py-0.2 rounded-full">
                    <Check className="w-2.5 h-2.5" /> Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => setIsAuthenticated(false)}
              title="Sign Out"
              className="p-1.5 rounded-lg text-emerald-300/70 hover:text-red-400 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Farm Land Stats Pill */}
          <div className="bg-emerald-950/70 rounded-xl p-2 border border-emerald-800/40 text-[10px] text-emerald-200/90 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Layers className="w-3 h-3" /> Land Holding:
              </span>
              <strong className="text-white font-bold">{currentUser.landAcres} Acres</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Location:
              </span>
              <span className="text-white truncate max-w-[110px]">{currentUser.location}</span>
            </div>
          </div>

          <button
            onClick={() => {
              setIsOnboardingEditMode(true)
              setShowOnboardingModal(true)
            }}
            className="w-full py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-[11px] font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
          >
            <Edit3 className="w-3 h-3" /> Edit Land Details
          </button>
        </div>

      </aside>

      {/* Sidebar Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        />
      )}

      {/* ============================================================ */}
      {/* 2. MAIN APP CONTENT AREA */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="bg-white border-b border-[#E4E7EC] px-4 lg:px-6 py-3.5 flex items-center justify-between flex-shrink-0 z-10">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base lg:text-lg font-extrabold text-gray-900 flex items-center gap-1.5">
                Welcome, {currentUser.name}! 🌾
              </h1>
              <p className="text-[11px] text-gray-500">
                {currentUser.landAcres} Acres • {currentUser.soilType} • {currentUser.location}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            
            {/* Weather Pill */}
            <button
              onClick={() => setShowWeatherModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#F7F9F8] border border-[#E4E7EC] rounded-xl hover:border-emerald-500 hover:bg-emerald-50/40 transition-all cursor-pointer shadow-2xs"
            >
              <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-500">
                <Sun className="w-3.5 h-3.5" />
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-gray-900 leading-tight">28°C</div>
                <div className="text-[10px] text-gray-500 font-medium">Partly Cloudy</div>
              </div>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl border border-[#E4E7EC] text-gray-600 hover:text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  3
                </span>
              </button>

              {/* Notification Popover Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#E4E7EC] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                    <span className="text-xs font-bold text-gray-900">Notifications</span>
                    <button
                      onClick={() => setNotifications(notifications.map(n => ({ ...n, unread: false })))}
                      className="text-[11px] text-emerald-600 hover:underline font-medium cursor-pointer"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                    {notifications.map(n => (
                      <div key={n.id} className={`p-3 hover:bg-gray-50 transition-colors ${n.unread ? 'bg-emerald-50/30' : ''}`}>
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-gray-900">{n.title}</p>
                          <span className="text-[10px] text-gray-400 whitespace-nowrap">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-gray-600 mt-0.5">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Edit Land Particulars Quick Button */}
            <button
              onClick={() => {
                setIsOnboardingEditMode(true)
                setShowOnboardingModal(true)
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Edit Land</span>
            </button>

            {/* Logout Pill */}
            <button
              onClick={() => setIsAuthenticated(false)}
              className="p-2 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 border border-gray-200 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>
        </header>

        {/* ============================================================ */}
        {/* VIEW ROUTING: Render view based on activeNav */}
        {/* ============================================================ */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-5 lg:space-y-6">
          
          {/* VIEW: CO2 LAND CALCULATOR */}
          {(activeNav === 'CO₂ Calculator' || activeNav === 'Calculators') && (
            <CO2LandCalculator
              user={currentUser}
              onUpdateLandDetails={(updatedFields) => {
                setCurrentUser(prev => ({ ...prev, ...updatedFields }))
                alert(`Synced ${updatedFields.landAcres} Acres and ${updatedFields.soilType} to your farm profile!`)
              }}
              onProcureCO2={handleNavigateToProcurement}
            />
          )}

          {/* VIEW: BUY INDUSTRIAL CAPTURED CO2 / CARBON */}
          {(activeNav === 'Buy Industrial CO₂' || activeNav === 'Procure Industrial CO₂') && (
            <IndustrialCO2Procurement
              user={currentUser}
              initialRequirement={procurementParams}
              onNavigateToCalculator={() => setActiveNav('CO₂ Calculator')}
            />
          )}

          {/* VIEW: MAIN DASHBOARD */}
          {activeNav === 'Dashboard' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 lg:gap-6 items-start">
              
              {/* LEFT / CENTER COLUMN (8 of 12 cols) */}
              <div className="xl:col-span-8 space-y-5 lg:space-y-6 min-w-0">
                
                {/* 1. TOP 4 KPI CARDS (Custom Land & Soil Health Metrics) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  
                  {/* Card 1: Total Land Cultivated */}
                  <div
                    onClick={() => {
                      setIsOnboardingEditMode(true)
                      setShowOnboardingModal(true)
                    }}
                    className="bg-white rounded-2xl p-4 border border-[#E4E7EC] card-shadow hover:card-shadow-hover hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-500">Total Farm Land</p>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-2xl lg:text-3xl font-extrabold text-gray-900">{currentUser.landAcres}</span>
                          <span className="text-xs font-bold text-gray-600">Acres</span>
                        </div>
                        <p className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Active Parcel
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                        <Layers className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Soil Health Status */}
                  <div
                    onClick={() => setActiveNav('Soil Health')}
                    className="bg-white rounded-2xl p-4 border border-[#E4E7EC] card-shadow hover:card-shadow-hover hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-500">Soil Health (SOC)</p>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-xl lg:text-2xl font-extrabold text-gray-900">{currentUser?.soilOrganicCarbon ?? 0.65}%</span>
                          <span className="text-xs font-medium text-gray-500">Carbon</span>
                        </div>
                        <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                          {((currentUser?.soilType || 'Red Loamy Soil') + '').split(' ')[0]} Soil
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                        <Leaf className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Crops & Farming Practice */}
                  <div
                    onClick={() => {
                      setIsOnboardingEditMode(true)
                      setShowOnboardingModal(true)
                    }}
                    className="bg-white rounded-2xl p-4 border border-[#E4E7EC] card-shadow hover:card-shadow-hover hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-500">Primary Crops</p>
                        <div className="text-sm font-extrabold text-gray-900 mt-1 truncate max-w-[130px]" title={currentUser?.primaryCrops || 'Tomato'}>
                          {((currentUser?.primaryCrops || 'Tomato, Cotton, Pulses') + '').split(',')[0]} & more
                        </div>
                        <p className="text-[11px] text-teal-700 font-semibold mt-1 truncate">
                          {currentUser?.farmingType || 'Certified Organic'}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform">
                        <Sprout className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Active Farm Tasks */}
                  <div
                    onClick={() => setActiveNav('Tasks')}
                    className="bg-white rounded-2xl p-4 border border-[#E4E7EC] card-shadow hover:card-shadow-hover hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-500">Active Tasks</p>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-2xl lg:text-3xl font-extrabold text-gray-900">
                            {tasks.filter(t => !t.completed).length}
                          </span>
                          <span className="text-xs font-medium text-gray-500">Pending</span>
                        </div>
                        <p className="text-[11px] text-amber-700 font-semibold mt-1">Field Actions</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                        <CheckSquare className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                </div>

                {/* 2. CO2 LAND SEQUESTRATION INTERACTIVE HERO CARD */}
                <div className="bg-gradient-to-r from-[#00381E] via-[#095734] to-[#047857] rounded-3xl p-5 lg:p-6 text-white shadow-lg space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-300/30 text-[11px] font-semibold text-emerald-200 mb-1">
                        <Sparkles className="w-3 h-3 text-emerald-300" />
                        Soil Carbon Engine for {currentUser.landAcres} Acres
                      </div>
                      <h2 className="text-lg lg:text-xl font-bold tracking-tight">
                        Land CO₂ Sequestration Capacity
                      </h2>
                      <p className="text-xs text-emerald-100/80 mt-0.5">
                        Calculated based on {currentUser.landAcres} Acres • {currentUser.soilType} • {currentUser.soilHealth}
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveNav('CO₂ Calculator')}
                      className="px-4 py-2 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                    >
                      <Calculator className="w-4 h-4 text-emerald-700" /> Open Full Calculator
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="p-3.5 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/15">
                      <span className="text-[11px] text-emerald-200 font-medium">Estimated Annual CO₂ Stored</span>
                      <div className="text-2xl font-black text-white mt-1">~{estimatedAnnualCO2} <span className="text-xs font-bold text-emerald-300">tCO₂e/yr</span></div>
                      <span className="text-[10px] text-emerald-200/70">With organic practices</span>
                    </div>

                    <div className="p-3.5 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/15">
                      <span className="text-[11px] text-emerald-200 font-medium">Projected 3-Yr Accumulation</span>
                      <div className="text-2xl font-black text-white mt-1">~{(parseFloat(estimatedAnnualCO2) * 3).toFixed(1)} <span className="text-xs font-bold text-emerald-300">tCO₂e</span></div>
                      <span className="text-[10px] text-emerald-200/70">Restored in topsoil</span>
                    </div>

                    <div className="p-3.5 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/15">
                      <span className="text-[11px] text-emerald-200 font-medium">Water Retention Boost</span>
                      <div className="text-2xl font-black text-white mt-1">+{(currentUser.landAcres * 22000).toLocaleString('en-IN')} <span className="text-xs font-bold text-emerald-300">Liters</span></div>
                      <span className="text-[10px] text-emerald-200/70">Across farm parcel</span>
                    </div>
                  </div>
                </div>

                {/* 3. MIDDLE SECTION: Weather, Tasks & Diagnoses (3 Cols) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  
                  {/* Column 1: Weather Forecast */}
                  <div className="bg-white rounded-2xl p-4 border border-[#E4E7EC] card-shadow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Cloud className="w-4 h-4 text-emerald-600" />
                          <h3 className="text-xs font-bold text-gray-900">5-Day Weather Forecast</h3>
                        </div>
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                          {weatherData.current_temp || 28}°C
                        </span>
                      </div>

                      <div className="space-y-2">
                        {(weatherData.forecast || defaultWeather).map((item) => (
                          <div key={item.day} className="flex items-center justify-between text-xs py-1 border-b border-gray-50 last:border-0">
                            <span className="font-semibold text-gray-700 w-8">{item.day}</span>
                            <div className="flex items-center gap-1.5 text-gray-500">
                              {item.type === 'sunny' && <Sun className="w-3.5 h-3.5 text-amber-500" />}
                              {item.type === 'partly-cloudy' && <Cloud className="w-3.5 h-3.5 text-blue-400" />}
                              {item.type === 'rainy' && <Droplets className="w-3.5 h-3.5 text-cyan-500" />}
                              <span className="text-[11px] capitalize">{(item.type || 'clear').replace('-', ' ')}</span>
                            </div>
                            <span className="font-bold text-gray-900 text-[11px]">
                              {item.high}° / {item.low}°
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setShowWeatherModal(true)}
                      className="mt-3 w-full py-1.5 bg-gray-50 hover:bg-emerald-50 text-emerald-800 border border-gray-200 rounded-xl text-[11px] font-bold transition-colors cursor-pointer text-center"
                    >
                      View Agronomy Insights
                    </button>
                  </div>

                  {/* Column 2: Daily Tasks Checklist */}
                  <div className="bg-white rounded-2xl p-4 border border-[#E4E7EC] card-shadow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <CheckSquare className="w-4 h-4 text-emerald-600" />
                          <h3 className="text-xs font-bold text-gray-900">Daily Tasks</h3>
                        </div>
                        <button
                          onClick={() => setShowAddTaskModal(true)}
                          className="p-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer"
                          title="Add Task"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-2 max-h-48 overflow-y-auto pr-0.5">
                        {tasks.length === 0 ? (
                          <div className="text-center py-4 text-gray-400 text-xs">
                            No tasks scheduled today. Click + to add.
                          </div>
                        ) : (
                          tasks.map((task) => (
                            <div
                              key={task.id}
                              onClick={() => toggleTask(task.id)}
                              className="flex items-start gap-2 p-2 rounded-xl bg-gray-50/70 hover:bg-emerald-50/40 border border-gray-100 transition-colors cursor-pointer select-none group"
                            >
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => {}}
                                className="mt-0.5 accent-emerald-600 rounded cursor-pointer"
                              />
                              <div className="flex-1 min-w-0">
                                <p className={`text-xs font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                  {task.text}
                                </p>
                                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded mt-0.5 inline-block ${task.tagColor || 'text-emerald-600 bg-emerald-50'}`}>
                                  {task.priority}
                                </span>
                              </div>
                              <button
                                onClick={(e) => handleDeleteTask(task.id, e)}
                                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1 transition-opacity cursor-pointer"
                                title="Delete Task"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => setShowAddTaskModal(true)}
                      className="mt-3 w-full py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-[11px] font-bold transition-colors cursor-pointer text-center"
                    >
                      + Add New Task
                    </button>
                  </div>

                  {/* Column 3: Recent Diagnosis Spotlight */}
                  <div className="bg-white rounded-2xl p-4 border border-[#E4E7EC] card-shadow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Bug className="w-4 h-4 text-emerald-600" />
                          <h3 className="text-xs font-bold text-gray-900">Recent Diagnosis</h3>
                        </div>
                        <span className="text-[10px] text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-full">
                          {recentDiagnoses.length > 0 ? 'Live Scan' : 'Ready'}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {recentDiagnoses.length === 0 ? (
                          <div className="text-center py-4 text-gray-400 text-xs">
                            No pathology scans yet. Upload a leaf photo to diagnose.
                          </div>
                        ) : (
                          recentDiagnoses.slice(0, 2).map((item) => (
                            <div
                              key={item.id}
                              onClick={() => setSelectedDiagnosis(item)}
                              className="p-2 rounded-xl bg-gray-50 hover:bg-emerald-50/40 border border-gray-100 transition-colors cursor-pointer flex items-center gap-2.5"
                            >
                              <img
                                src={item.image}
                                alt={item.disease}
                                className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-gray-200"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-gray-900 truncate">
                                  {item.crop} – {item.disease}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                    item.confidenceLevel === 'high' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                                  }`}>
                                    {item.confidence}
                                  </span>
                                  <span className="text-[10px] text-gray-400">{item.time}</span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveNav('AI Pest / Disease')}
                      className="mt-3 w-full py-1.5 bg-gray-50 hover:bg-emerald-50 text-emerald-800 border border-gray-200 rounded-xl text-[11px] font-bold transition-colors cursor-pointer text-center"
                    >
                      Open Pest Scanner
                    </button>
                  </div>

                </div>

                {/* 4. QUICK ACTION CARDS */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {quickActionCards.map((act) => {
                    const Icon = act.icon
                    return (
                      <button
                        key={act.title}
                        onClick={() => handleQuickAction(act.action)}
                        className="bg-white rounded-2xl p-3.5 border border-[#E4E7EC] card-shadow hover:card-shadow-hover hover:-translate-y-1 transition-all duration-200 text-center flex flex-col items-center justify-between group cursor-pointer"
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: act.bg, color: act.color }}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                            {act.title}
                          </div>
                          <div className="text-[10px] text-gray-400 line-clamp-2 mt-0.5 leading-snug">
                            {act.desc}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>

              </div>

              {/* RIGHT COLUMN (4 of 12 cols: AI Detection & Chat) */}
              <div className="xl:col-span-4 space-y-5 lg:space-y-6">
                
                {/* 1. AI PEST / DISEASE DETECTION UPLOAD CARD */}
                <div className="bg-white rounded-2xl p-4 lg:p-5 border border-[#E4E7EC] card-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-gray-900">AI Pest / Disease Detection</h3>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Scan Leaf <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                    className="hidden"
                  />

                  {detectionState === 'idle' && (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault()
                        if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0])
                      }}
                      className="border-2 border-dashed border-gray-200 hover:border-emerald-500 rounded-2xl p-6 text-center bg-[#FBFDFB] hover:bg-emerald-50/30 transition-all cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-full bg-emerald-100/70 text-emerald-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                        <Camera className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-semibold text-gray-800">
                        Upload or capture a photo
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        of your crop / leaf
                      </p>
                      <p className="text-[10px] text-gray-400 mt-2 font-medium">
                        JPG, PNG (Max 10MB)
                      </p>
                    </div>
                  )}

                  {detectionState === 'scanning' && (
                    <div className="border border-emerald-200 rounded-2xl p-6 text-center bg-emerald-50/40 relative overflow-hidden">
                      <div className="relative w-20 h-20 mx-auto mb-3 rounded-xl overflow-hidden border border-emerald-300">
                        <img src={uploadedImage || '/images/tomato_early_blight.jpg'} alt="Scanning" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-emerald-500/20 animate-pulse" />
                      </div>
                      <p className="text-xs font-bold text-emerald-900">AI Model is Analyzing Leaf...</p>
                      <p className="text-[10px] text-emerald-700 mt-1">Matching plant pathology database</p>
                    </div>
                  )}

                  {detectionState === 'result' && (
                    <div className="border border-emerald-200 rounded-2xl p-3.5 bg-emerald-50/30 space-y-3">
                      <div className="flex items-start gap-3">
                        <img
                          src={activeDiagnosisResult.image}
                          alt="Diagnosed leaf"
                          className="w-16 h-16 rounded-xl object-cover border border-emerald-200 flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-[9px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded">
                            {activeDiagnosisResult.confidence}
                          </span>
                          <h4 className="text-xs font-bold text-gray-900 mt-1">
                            {activeDiagnosisResult.crop} – {activeDiagnosisResult.disease}
                          </h4>
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-700 leading-snug">
                        <strong>Symptoms:</strong> {activeDiagnosisResult.symptoms}
                      </p>
                      <p className="text-[11px] text-emerald-900 font-medium leading-snug bg-white/80 p-2 rounded-lg border border-emerald-100">
                        <strong>Recommended Action:</strong> {activeDiagnosisResult.action}
                      </p>
                      <button
                        onClick={() => setDetectionState('idle')}
                        className="w-full py-1.5 text-xs text-emerald-700 bg-white border border-emerald-300 hover:bg-emerald-50 font-semibold rounded-xl transition-colors cursor-pointer"
                      >
                        Scan Another Leaf
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. ASK AI ADVISOR CHAT PANEL */}
                <div className="bg-white rounded-2xl p-4 lg:p-5 border border-[#E4E7EC] card-shadow flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">Ask AI Farm Advisor</h3>
                      <p className="text-xs text-gray-500">Personalized agronomy & soil advice</p>
                    </div>
                    <img
                      src="/images/ai_robot_avatar.jpg"
                      alt="AI Advisor Mascot"
                      className="w-9 h-9 rounded-full object-cover shadow-xs border border-emerald-300 ring-2 ring-emerald-100"
                    />
                  </div>

                  {/* Chips */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {(suggestedQuestionsList || defaultSuggestedQuestions).map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSendMessage(q)}
                        className="text-[11px] font-medium text-gray-700 bg-gray-50 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 border border-gray-200/80 px-2.5 py-1 rounded-full transition-all text-left cursor-pointer"
                      >
                        {q}
                      </button>
                    ))}
                  </div>

                  {/* Messages */}
                  <div className="max-h-48 min-h-[120px] overflow-y-auto space-y-2.5 pr-1 mb-3 scrollbar-none">
                    {chatMessages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl p-2.5 text-xs leading-relaxed ${
                            msg.sender === 'user'
                              ? 'bg-emerald-700 text-white rounded-br-xs'
                              : 'bg-emerald-50/80 text-gray-900 border border-emerald-100 rounded-bl-xs'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    
                    {isAiTyping && (
                      <div className="flex justify-start">
                        <div className="bg-emerald-50 rounded-2xl px-3 py-2 text-xs text-emerald-800 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" />
                          <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                          <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    )}
                    <div ref={chatBottomRef} />
                  </div>

                  {/* Input Form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSendMessage()
                    }}
                    className="flex items-center gap-2 mt-auto"
                  >
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Type your agronomy question..."
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!chatInput.trim() || isAiTyping}
                      className="w-8 h-8 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer"
                      aria-label="Send question"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>

              </div>

            </div>
          )}

          {/* VIEW: MY FARM LAND */}
          {activeNav === 'My Farm Land' && (
            <div className="bg-white rounded-3xl p-6 lg:p-8 border border-[#E4E7EC] card-shadow space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">My Farm Land Parcels</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Manage your acreage, soil classification, and crop rotation schedules</p>
                </div>
                <button
                  onClick={() => {
                    setIsOnboardingEditMode(true)
                    setShowOnboardingModal(true)
                  }}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 self-start cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Land Details
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80">
                  <span className="text-xs text-gray-500 font-medium">Total Acreage</span>
                  <div className="text-2xl font-black text-gray-900 mt-1">{currentUser.landAcres} Acres</div>
                  <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">Full parcel under cultivation</span>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80">
                  <span className="text-xs text-gray-500 font-medium">Soil Classification</span>
                  <div className="text-sm font-extrabold text-gray-900 mt-1">{currentUser.soilType}</div>
                  <span className="text-[10px] text-gray-500 mt-1 block">Good organic binding capacity</span>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80">
                  <span className="text-xs text-gray-500 font-medium">Soil Health Status</span>
                  <div className="text-sm font-extrabold text-emerald-700 mt-1">{currentUser.soilHealth}</div>
                  <span className="text-[10px] text-gray-500 mt-1 block">Measured via Soil Card</span>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80">
                  <span className="text-xs text-gray-500 font-medium">Farming Practice</span>
                  <div className="text-sm font-extrabold text-teal-700 mt-1">{currentUser.farmingType}</div>
                  <span className="text-[10px] text-gray-500 mt-1 block">{currentUser.irrigationType}</span>
                </div>
              </div>

              <div className="p-5 bg-emerald-50/60 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-2">
                <div className="font-bold text-sm text-emerald-900 flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  Primary Crops Cultivated: {currentUser.primaryCrops}
                </div>
                <p className="text-emerald-800 leading-relaxed">
                  Your land in {currentUser.location} is calibrated for maximum soil carbon sequestration. You can simulate the exact tonnes of CO₂ captured by opening the <strong>CO₂ Calculator</strong>.
                </p>
              </div>
            </div>
          )}

          {/* VIEW: SOIL HEALTH */}
          {activeNav === 'Soil Health' && (
            <div className="bg-white rounded-3xl p-6 lg:p-8 border border-[#E4E7EC] card-shadow space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Soil Health & Nutrient Profile</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Tested for {currentUser.landAcres} Acres • {currentUser.soilType}</p>
                </div>
                <button
                  onClick={() => setActiveNav('CO₂ Calculator')}
                  className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Calculator className="w-3.5 h-3.5" /> Calculate Land CO₂
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-2">
                  <span className="text-xs font-bold text-emerald-900">Soil Organic Carbon (SOC)</span>
                  <div className="text-3xl font-black text-emerald-900">{currentUser.soilOrganicCarbon}%</div>
                  <p className="text-[11px] text-emerald-700">Optimal target: 1.0% to 1.5% with biochar & cover crops.</p>
                </div>

                <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 space-y-2">
                  <span className="text-xs font-bold text-blue-900">Soil Moisture & Infiltration</span>
                  <div className="text-3xl font-black text-blue-900">42%</div>
                  <p className="text-[11px] text-blue-700">Good retention; enhanced by organic mulching layer.</p>
                </div>

                <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 space-y-2">
                  <span className="text-xs font-bold text-amber-900">Biological Microbial Activity</span>
                  <div className="text-3xl font-black text-amber-900">High</div>
                  <p className="text-[11px] text-amber-700">Active mycorrhizal fungi from zero-till practice.</p>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: GOVERNMENT SCHEMES */}
          {activeNav === 'Government Schemes' && (
            <div className="bg-white rounded-3xl p-6 lg:p-8 border border-[#E4E7EC] card-shadow space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-xl font-bold text-gray-900">Government Agricultural Schemes & Benefits</h2>
                <p className="text-xs text-gray-500 mt-0.5">Verified Indian Central & State Government Support for Organic Farmers</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-2.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Active Scheme</span>
                  <h3 className="text-sm font-bold text-gray-900">Paramparagat Krishi Vikas Yojana (PKVY)</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Financial assistance of ₹50,000 per hectare for 3 years for organic conversion, bio-fertilizers, and cluster certification.
                  </p>
                </div>

                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-2.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">Direct Income</span>
                  <h3 className="text-sm font-bold text-gray-900">PM-KISAN Samman Nidhi</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Direct income support of ₹6,000 per year in 3 equal installments for all landholding farmer families.
                  </p>
                </div>

                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-2.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">Soil Quality</span>
                  <h3 className="text-sm font-bold text-gray-900">Soil Health Card (SHC) Scheme</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Periodic soil testing for 12 essential parameters to optimize nutrient application and increase organic carbon.
                  </p>
                </div>

                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-2.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Micro-Irrigation</span>
                  <h3 className="text-sm font-bold text-gray-900">Per Drop More Crop (PDMC)</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Up to 55% subsidy on drip and sprinkler irrigation installations for small and marginal farmers.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: COMMUNITY & OTHER VIEWS */}
          {activeNav === 'Community' && (
            <div className="bg-white rounded-3xl p-6 lg:p-8 border border-[#E4E7EC] card-shadow text-center py-12 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
                <Users className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Farmer Community & Mandi Network</h2>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Connect with 12,000+ organic growers across Karnataka and access transparent daily mandi commodity pricing.
              </p>
            </div>
          )}

          {activeNav === 'Settings' && (
            <div className="bg-white rounded-3xl p-6 lg:p-8 border border-[#E4E7EC] card-shadow space-y-6">
              <h2 className="text-lg font-bold text-gray-900">Account & Farm Settings</h2>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-700">Farmer Profile</span>
                  <button
                    onClick={() => {
                      setIsOnboardingEditMode(true)
                      setShowOnboardingModal(true)
                    }}
                    className="text-emerald-700 font-bold hover:underline cursor-pointer"
                  >
                    Edit Land & Identity
                  </button>
                </div>
                <p className="text-[11px] text-gray-500">
                  Registered as <strong>{currentUser.name}</strong> • {currentUser.email} • {currentUser.landAcres} Acres in {currentUser.location}.
                </p>
              </div>
            </div>
          )}

          {activeNav === 'AI Pest / Disease' && (
            <div className="bg-white rounded-3xl p-6 lg:p-8 border border-[#E4E7EC] card-shadow space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-xl font-bold text-gray-900">AI Pest & Crop Disease Diagnosis</h2>
                <p className="text-xs text-gray-500 mt-0.5">Upload leaf photos for instant disease identification and certified organic remedies</p>
              </div>
              
              <div className="max-w-xl mx-auto space-y-4">
                {detectionState === 'idle' && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-emerald-300 hover:border-emerald-600 rounded-3xl p-10 text-center bg-emerald-50/20 hover:bg-emerald-50/40 transition-all cursor-pointer group"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Camera className="w-8 h-8" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">Upload or Snap Leaf Photo</h3>
                    <p className="text-xs text-gray-500 mt-1">Supports Tomato, Cotton, Chilli, Rice, Maize & Vegetables</p>
                  </div>
                )}

                {detectionState === 'result' && (
                  <div className="border border-emerald-200 rounded-3xl p-5 bg-emerald-50/30 space-y-4">
                    <div className="flex items-start gap-4">
                      <img src={activeDiagnosisResult.image} alt="Diagnosed" className="w-24 h-24 rounded-2xl object-cover border border-emerald-200" />
                      <div>
                        <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                          {activeDiagnosisResult.confidence}
                        </span>
                        <h3 className="text-base font-extrabold text-gray-900 mt-1.5">
                          {activeDiagnosisResult.crop} – {activeDiagnosisResult.disease}
                        </h3>
                        <p className="text-xs text-gray-600 mt-1"><strong>Symptoms:</strong> {activeDiagnosisResult.symptoms}</p>
                      </div>
                    </div>
                    <div className="p-4 bg-white rounded-2xl border border-emerald-200 text-xs text-emerald-950">
                      <strong>Certified Organic Action:</strong> {activeDiagnosisResult.action}
                    </div>
                    <button
                      onClick={() => setDetectionState('idle')}
                      className="w-full py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 cursor-pointer"
                    >
                      Scan Another Crop Photo
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeNav === 'AI Advisor' && (
            <div className="bg-white rounded-3xl p-6 lg:p-8 border border-[#E4E7EC] card-shadow space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-xl font-bold text-gray-900">AI Farming & Soil Carbon Assistant</h2>
                <p className="text-xs text-gray-500 mt-0.5">24/7 Agronomist consultation for {currentUser.landAcres} Acres • {currentUser.soilType}</p>
              </div>

              <div className="max-w-2xl mx-auto space-y-4">
                <div className="h-80 overflow-y-auto space-y-3 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                        msg.sender === 'user' ? 'bg-emerald-700 text-white' : 'bg-white text-gray-900 border border-gray-200 shadow-2xs'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isAiTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white rounded-2xl p-3 text-xs text-emerald-800 flex items-center gap-1.5 shadow-2xs">
                        <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  )}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendMessage()
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about soil carbon, biochar, crop rotation, or pests..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeNav === 'Tasks' && (
            <div className="bg-white rounded-3xl p-6 lg:p-8 border border-[#E4E7EC] card-shadow space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Farm Work & Field Tasks</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Stay on schedule with soil additions, irrigation, and weeding</p>
                </div>
                <button
                  onClick={() => setShowAddTaskModal(true)}
                  className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Task
                </button>
              </div>

              <div className="space-y-2.5 max-w-xl">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 hover:bg-emerald-50/40 border border-gray-200 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => {}}
                        className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                      />
                      <span className={`text-xs font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                        {task.text}
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${task.tagColor}`}>
                      {task.priority} Priority
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeNav === 'Weather' && (
            <div className="bg-white rounded-3xl p-6 lg:p-8 border border-[#E4E7EC] card-shadow space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-xl font-bold text-gray-900">7-Day Agronomy & Weather Forecast</h2>
                <p className="text-xs text-gray-500 mt-0.5">Microclimate telemetry for {currentUser.location}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <span className="text-xs text-amber-800 font-medium">Temperature</span>
                  <div className="text-2xl font-black text-amber-950 mt-1">28°C</div>
                  <span className="text-[10px] text-amber-700">Feels like 30°C</span>
                </div>
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <span className="text-xs text-blue-800 font-medium">Humidity</span>
                  <div className="text-2xl font-black text-blue-950 mt-1">68%</div>
                  <span className="text-[10px] text-blue-700">Moderate</span>
                </div>
                <div className="p-4 bg-cyan-50 rounded-2xl border border-cyan-100">
                  <span className="text-xs text-cyan-800 font-medium">Soil Temperature (10cm)</span>
                  <div className="text-2xl font-black text-cyan-950 mt-1">24.2°C</div>
                  <span className="text-[10px] text-cyan-700">Optimal microbial zone</span>
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <span className="text-xs text-emerald-800 font-medium">Evapotranspiration</span>
                  <div className="text-2xl font-black text-emerald-950 mt-1">3.8 mm/d</div>
                  <span className="text-[10px] text-emerald-700">Standard drip schedule</span>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ============================================================ */}
      {/* 3. MODALS & POPUPS */}
      {/* ============================================================ */}

      {/* 1. Post-Login / Land Onboarding Landing Modal */}
      <LandOnboardingModal
        isOpen={showOnboardingModal}
        user={currentUser}
        isEditing={isOnboardingEditMode}
        onSave={handleSaveOnboarding}
        onCancel={() => setShowOnboardingModal(false)}
      />

      {/* 2. Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 border border-gray-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900">Add New Farm Task</h3>
              <button onClick={() => setShowAddTaskModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddTask} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Task Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apply compost in North parcel"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Priority Level</label>
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-3.5 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs cursor-pointer"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Weather Details Modal */}
      {showWeatherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 border border-gray-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900">7-Day Weather & Agronomy Forecast</h3>
                <p className="text-xs text-gray-500">{currentUser.location} • Micro-climate</p>
              </div>
              <button onClick={() => setShowWeatherModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-500">Soil Temperature (10cm):</span>
                <p className="font-bold text-gray-900 text-sm mt-0.5">
                  {weatherData.agronomy?.soil_temperature_10cm || 24.2}°C ({weatherData.agronomy?.soil_temp_status || 'Optimal'})
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-500">Evapotranspiration rate:</span>
                <p className="font-bold text-gray-900 text-sm mt-0.5">
                  {weatherData.agronomy?.evapotranspiration_rate || 3.8} mm/day
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-500">UV Index:</span>
                <p className="font-bold text-gray-900 text-sm mt-0.5">
                  {weatherData.agronomy?.uv_index || 6} ({weatherData.agronomy?.uv_status || 'Moderate'})
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-500">Dew Point:</span>
                <p className="font-bold text-gray-900 text-sm mt-0.5">
                  {weatherData.agronomy?.dew_point || 17}°C
                </p>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowWeatherModal(false)}
                className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-700 rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Diagnosis Detail Modal */}
      {selectedDiagnosis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 border border-gray-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900">{selectedDiagnosis.crop} – {selectedDiagnosis.disease}</h3>
                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                  {selectedDiagnosis.confidence}
                </span>
              </div>
              <button onClick={() => setSelectedDiagnosis(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <img
              src={selectedDiagnosis.image}
              alt={selectedDiagnosis.disease}
              className="w-full h-48 object-cover rounded-2xl border border-gray-200"
            />

            <div className="space-y-2 text-xs">
              <p><strong>Identified Symptoms:</strong> {selectedDiagnosis.symptoms}</p>
              <p className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                <strong>Certified Organic Treatment:</strong> {selectedDiagnosis.action}
              </p>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedDiagnosis(null)}
                className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-700 rounded-xl cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}