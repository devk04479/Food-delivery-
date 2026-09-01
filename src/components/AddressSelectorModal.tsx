import React, { useState } from 'react';
import { MapPin, X, Plus, Check } from 'lucide-react';
import { Address } from '../types';

interface AddressSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedAddresses: Address[];
  selectedAddress: Address | null;
  onSelectAddress: (address: Address) => void;
  onAddNewAddress: (address: Omit<Address, 'id'>) => void;
}

export const AddressSelectorModal: React.FC<AddressSelectorModalProps> = ({
  isOpen,
  onClose,
  savedAddresses,
  selectedAddress,
  onSelectAddress,
  onAddNewAddress,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('110001');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!street.trim()) return;

    onAddNewAddress({
      title,
      street: street.trim(),
      landmark: landmark.trim() || undefined,
      city: 'New Delhi',
      pincode: pincode.trim(),
    });

    setStreet('');
    setLandmark('');
    setIsAdding(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4 animate-scaleIn">
        
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-600" />
            <h3 className="text-base font-extrabold text-stone-900 font-serif">
              Select Delivery Location
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isAdding ? (
          <div className="space-y-3">
            <div className="space-y-2">
              {savedAddresses.map((addr) => {
                const isSelected = selectedAddress?.id === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => {
                      onSelectAddress(addr);
                      onClose();
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/80 shadow-2xs'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-orange-600 text-white' : 'bg-stone-100 text-stone-600'}`}>
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                          <span>{addr.title}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] bg-stone-200 text-stone-600 px-1 rounded font-semibold">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-600 truncate mt-0.5">{addr.street}</p>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setIsAdding(true)}
              className="w-full py-3 rounded-2xl border-2 border-dashed border-orange-300 hover:border-orange-500 text-orange-600 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Delivery Address</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-800">Add New Address</span>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                Cancel
              </button>
            </div>

            <div className="flex gap-2">
              {(['Home', 'Work', 'Other'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTitle(t)}
                  className={`px-3 py-1 rounded-lg font-bold border transition-colors ${
                    title === t ? 'bg-orange-600 text-white border-orange-600' : 'bg-stone-50 border-stone-200 text-stone-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Street Address *</label>
              <input
                type="text"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="e.g. Flat 12B, Green Park View"
                className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Landmark</label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="Near City Hospital"
                  className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Zip Code</label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl mt-2"
            >
              Save and Select
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
