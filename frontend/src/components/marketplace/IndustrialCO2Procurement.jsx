import React, { useState } from 'react'
import { Factory, ShoppingCart, CheckCircle2, ArrowLeft, Building2 } from 'lucide-react'

export function IndustrialCO2Procurement({ user, initialRequirement, onNavigateToCalculator }) {
  const [requestedTonnes, setRequestedTonnes] = useState(
    initialRequirement?.defaultTonnes || (user?.landAcres ? (user.landAcres * 1.15).toFixed(1) : '5.5')
  )
  const [deliveryAddress, setDeliveryAddress] = useState(user?.location || 'Mandya, Karnataka, India')
  const [selectedProduct, setSelectedProduct] = useState('prod-1')
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const products = [
    {
      id: 'prod-1',
      name: 'Certified Biochar CO₂ Substrate',
      purity: '85% Fixed Carbon',
      pricePerTonne: 4500,
      supplier: 'GreenTech Carbon Capture Ltd',
      description: 'Pyrolyzed agricultural biomass infused with captured industrial CO₂. Long-term topsoil carbon binding (100+ years).',
      rating: '4.9 ★',
    },
    {
      id: 'prod-2',
      name: 'Enriched CO₂ Organic Liquid Extract',
      purity: 'High Microbial Activation',
      pricePerTonne: 3800,
      supplier: 'BioCarbon Industries',
      description: 'Liquid soil amendment enriched with captured bio-CO₂ and humic acid for rapid microbial activation.',
      rating: '4.8 ★',
    },
  ]

  const product = products.find(p => p.id === selectedProduct) || products[0]
  const tonnesNum = parseFloat(requestedTonnes) || 1
  const subtotal = tonnesNum * product.pricePerTonne
  const deliveryFee = 1300
  const gst = subtotal * 0.05
  const grandTotal = subtotal + deliveryFee + gst

  const handleOrderSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setOrderSuccess(true)
    }, 600)
  }

  return (
    <div className="bg-white rounded-3xl p-6 lg:p-8 border border-[#E4E7EC] card-shadow space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[11px] font-bold mb-1">
            <Factory className="w-3.5 h-3.5 text-teal-600" />
            Certified Carbon Procurement
          </div>
          <h2 className="text-xl font-extrabold text-gray-900">Procure Industrial Captured CO₂ & Biochar</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Direct procurement from certified industrial carbon capture plants for soil application on {user?.landAcres || 5} Acres.
          </p>
        </div>

        {onNavigateToCalculator && (
          <button
            onClick={onNavigateToCalculator}
            className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 self-start cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Calculator
          </button>
        )}
      </div>

      {orderSuccess ? (
        <div className="p-8 bg-emerald-50 rounded-3xl border border-emerald-200 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Procurement Order Confirmed!</h3>
          <p className="text-xs text-emerald-800 max-w-md mx-auto">
            Your order for <strong>{requestedTonnes} Tonnes</strong> of {product.name} has been dispatched from {product.supplier}. Delivery scheduled to <strong>{deliveryAddress}</strong>.
          </p>
          <button
            onClick={() => setOrderSuccess(false)}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Place Another Order
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-sm font-bold text-gray-900">Select Captured Carbon Product</h3>

            <div className="space-y-3">
              {products.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedProduct(p.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedProduct === p.id
                      ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-500'
                      : 'border-gray-200 bg-gray-50/50 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {p.purity}
                      </span>
                      <h4 className="text-xs font-bold text-gray-900 mt-1">{p.name}</h4>
                      <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3" /> {p.supplier}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-gray-900">₹{p.pricePerTonne.toLocaleString('en-IN')}</div>
                      <span className="text-[10px] text-gray-500">per Tonne</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-600 mt-2 leading-relaxed">{p.description}</p>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleOrderSubmit} className="lg:col-span-5 bg-gray-50 p-5 rounded-2xl border border-gray-200 text-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2">Order & Dispatch Summary</h3>

            <div>
              <label className="font-bold text-gray-800 block mb-1">Required Quantity (Tonnes)</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                required
                value={requestedTonnes}
                onChange={(e) => setRequestedTonnes(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 font-bold text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-gray-800 block mb-1">Delivery Destination</label>
              <input
                type="text"
                required
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5 pt-2 border-t border-gray-200">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({requestedTonnes} Tonnes):</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Freight & Transport:</span>
                <span>₹{deliveryFee.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST (5%):</span>
                <span>₹{gst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm text-gray-900 pt-2 border-t border-gray-200">
                <span>Grand Total:</span>
                <span className="text-emerald-700">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <ShoppingCart className="w-4 h-4" />
              {loading ? 'Processing Procurement...' : 'Confirm Procurement Order'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
