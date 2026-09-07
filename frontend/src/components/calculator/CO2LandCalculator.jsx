import React, { useState } from 'react'
import { Calculator, Leaf, Factory, Sparkles, CheckCircle2, Droplets } from 'lucide-react'

export function CO2LandCalculator({ user, onUpdateLandDetails, onProcureCO2 }) {
  const [acres, setAcres] = useState(user?.landAcres || 5.0)
  const [soilType, setSoilType] = useState(user?.soilType || 'Red Loamy Soil')
  const [practice, setPractice] = useState('Cover Crop + Biochar')

  const multipliers = {
    'Cover Crop + Biochar': 1.45,
    'Biochar Addition Only': 1.20,
    'Zero-Till + Cover Crop': 1.10,
    'Organic Compost Substrate': 0.85,
  }

  const factor = multipliers[practice] || 1.15
  const annualSequestration = (acres * factor).toFixed(2)
  const threeYearSequestration = (acres * factor * 3).toFixed(2)
  const waterCapacityLiters = (acres * 22000).toLocaleString('en-IN')

  return (
    <div className="bg-white rounded-3xl p-6 lg:p-8 border border-[#E4E7EC] card-shadow space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold mb-1">
            <Calculator className="w-3.5 h-3.5 text-emerald-600" />
            Land Sequestration Simulator
          </div>
          <h2 className="text-xl font-extrabold text-gray-900">CO₂ Land Sequestration Calculator</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Simulate exact metric tonnes of CO₂ captured in topsoil based on land size and organic practice.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="space-y-4 md:col-span-1 bg-gray-50/80 p-5 rounded-2xl border border-gray-200 text-xs">
          <div>
            <label className="font-bold text-gray-800 block mb-1">Farm Land Size (Acres)</label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              value={acres}
              onChange={(e) => setAcres(parseFloat(e.target.value) || 1)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 font-bold text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-gray-800 block mb-1">Soil Classification</label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 font-bold text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="Red Loamy Soil">Red Loamy Soil</option>
              <option value="Black Cotton Soil">Black Cotton Soil</option>
              <option value="Alluvial Soil">Alluvial Soil</option>
              <option value="Sandy Loam">Sandy Loam</option>
              <option value="Laterite Soil">Laterite Soil</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-gray-800 block mb-1">Sustainable Carbon Practice</label>
            <select
              value={practice}
              onChange={(e) => setPractice(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 font-bold text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="Cover Crop + Biochar">Cover Crop + Biochar (1.45 tCO₂e/acre)</option>
              <option value="Biochar Addition Only">Biochar Addition Only (1.20 tCO₂e/acre)</option>
              <option value="Zero-Till + Cover Crop">Zero-Till + Cover Crop (1.10 tCO₂e/acre)</option>
              <option value="Organic Compost Substrate">Organic Compost Substrate (0.85 tCO₂e/acre)</option>
            </select>
          </div>

          {onUpdateLandDetails && (
            <button
              onClick={() => onUpdateLandDetails({ landAcres: acres, soilType })}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" /> Sync Calculated Acres to Farm Profile
            </button>
          )}
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="bg-gradient-to-r from-[#00381E] via-[#095734] to-[#047857] rounded-2xl p-6 text-white space-y-4 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                <Sparkles className="w-4 h-4" /> Simulated Output for {acres} Acres
              </span>
              <span className="text-[10px] font-semibold bg-white/10 px-2.5 py-1 rounded-full border border-white/20">
                {soilType}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white/10 backdrop-blur-xs rounded-xl border border-white/15">
                <span className="text-xs text-emerald-200 font-medium">Annual CO₂ Sequestration</span>
                <div className="text-3xl font-black text-white mt-1">~{annualSequestration} <span className="text-sm font-bold text-emerald-300">tCO₂e/year</span></div>
              </div>

              <div className="p-4 bg-white/10 backdrop-blur-xs rounded-xl border border-white/15">
                <span className="text-xs text-emerald-200 font-medium">3-Year Cumulative Storage</span>
                <div className="text-3xl font-black text-white mt-1">~{threeYearSequestration} <span className="text-sm font-bold text-emerald-300">tCO₂e</span></div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-emerald-100 border-t border-white/15">
              <span className="flex items-center gap-1">
                <Droplets className="w-4 h-4 text-cyan-300" /> Additional Water Storage Capacity:
              </span>
              <strong className="text-white font-bold">+{waterCapacityLiters} Liters</strong>
            </div>
          </div>

          <div className="p-5 bg-emerald-50/70 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-emerald-950">Procure Industrial CO₂ Substrate for {acres} Acres</h4>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                Need certified biochar or captured carbon substrate to achieve this capacity?
              </p>
            </div>
            {onProcureCO2 && (
              <button
                onClick={() => onProcureCO2({ defaultTonnes: annualSequestration, landAcres: acres, soilType })}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 flex-shrink-0 cursor-pointer shadow-xs"
              >
                <Factory className="w-4 h-4" /> Procure Industrial CO₂
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
