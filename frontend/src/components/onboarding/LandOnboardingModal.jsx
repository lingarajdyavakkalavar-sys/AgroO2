import React, { useState } from 'react'
import { MapPin, Layers, CheckCircle2, Sparkles, X, Edit3 } from 'lucide-react'

export function LandOnboardingModal({ isOpen, user, isEditing, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: user?.name || 'Ramesh Patil',
    landAcres: user?.landAcres || 5.0,
    soilType: user?.soilType || 'Red Loamy Soil',
    soilOrganicCarbon: user?.soilOrganicCarbon || 0.65,
    soilHealth: user?.soilHealth || 'Medium (0.65% SOC)',
    primaryCrops: user?.primaryCrops || 'Tomato, Cotton, Pulses',
    farmingType: user?.farmingType || 'Certified Organic',
    irrigationType: user?.irrigationType || 'Drip & Borewell',
    location: user?.location || 'Mandya, Karnataka, India',
  })
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave(formData)
    } catch (err) {
      alert(`Could not save land details: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg p-6 lg:p-8 border border-gray-200 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                {isEditing ? 'Update Farm Land Particulars' : 'Calibrate Your Farm Land'}
              </h2>
              <p className="text-xs text-gray-500">Configure acres, soil classification & crops</p>
            </div>
          </div>
          {onCancel && (
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-gray-700 block mb-1">Farmer Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Total Land (Acres)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={formData.landAcres}
                onChange={(e) => setFormData({ ...formData, landAcres: parseFloat(e.target.value) || 1 })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Soil Type</label>
              <select
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Red Loamy Soil">Red Loamy Soil</option>
                <option value="Black Cotton Soil">Black Cotton Soil</option>
                <option value="Alluvial Soil">Alluvial Soil</option>
                <option value="Sandy Loam">Sandy Loam</option>
                <option value="Laterite Soil">Laterite Soil</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Soil Organic Carbon (%)</label>
              <input
                type="number"
                step="0.05"
                min="0.1"
                max="3.0"
                value={formData.soilOrganicCarbon}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0.65
                  setFormData({
                    ...formData,
                    soilOrganicCarbon: val,
                    soilHealth: val < 0.4 ? `Low (${val}% SOC)` : val < 0.75 ? `Medium (${val}% SOC)` : `Good (${val}% SOC)`
                  })
                }}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Location / District</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Primary Crops Cultivated</label>
            <input
              type="text"
              required
              placeholder="e.g. Tomato, Cotton, Pulses"
              value={formData.primaryCrops}
              onChange={(e) => setFormData({ ...formData, primaryCrops: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Farming Type</label>
              <select
                value={formData.farmingType}
                onChange={(e) => setFormData({ ...formData, farmingType: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Certified Organic">Certified Organic</option>
                <option value="Natural Farming (ZNF)">Natural Farming (ZNF)</option>
                <option value="Integrated Farming">Integrated Farming</option>
                <option value="Conventional">Conventional</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Irrigation System</label>
              <select
                value={formData.irrigationType}
                onChange={(e) => setFormData({ ...formData, irrigationType: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Drip & Borewell">Drip & Borewell</option>
                <option value="Sprinkler System">Sprinkler System</option>
                <option value="Canal Irrigation">Canal Irrigation</option>
                <option value="Rainfed">Rainfed</option>
              </select>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Save & Calibrate Farm Land
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
