import React, { useState } from 'react';
import { Search, UserPlus, Phone, Mail, Award, ShoppingBag, ArrowRight, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';

export const CustomersScreen: React.FC = () => {
  const { customers, addOrUpdateCustomer, selectCustomerForBill, setActiveTab, setIsCartOpen, settings } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const filteredCustomers = customers.filter(
    c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    addOrUpdateCustomer({
      name: newName.trim(),
      phone: newPhone.trim(),
      email: newEmail.trim(),
    });

    setNewName('');
    setNewPhone('');
    setNewEmail('');
    setShowAddModal(false);
  };

  const handleStartBillForCustomer = (cust: Customer) => {
    selectCustomerForBill(cust);
    setActiveTab('menu');
    setIsCartOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden text-stone-100">
      {/* Search Header */}
      <div className="shrink-0 p-3 bg-[#1e1009] border-b border-amber-900/30 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-amber-400/60 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by customer name or phone..."
            className="w-full bg-[#140b07] border border-amber-900/50 rounded-xl py-2 pl-9 pr-3 text-xs text-stone-100 focus:outline-none focus:border-amber-400 font-mono"
          />
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="h-9 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-sm active:scale-95 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Member</span>
        </button>
      </div>

      {/* Customer Directory List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredCustomers.length === 0 ? (
          <div className="py-16 text-center text-amber-300/50">
            <User className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-semibold">No customers matched</p>
            <p className="text-xs text-amber-200/50 mt-1">
              Tap 'Add Member' to register a new loyalty customer.
            </p>
          </div>
        ) : (
          filteredCustomers.map(cust => (
            <div
              key={cust.id}
              className="p-3.5 rounded-2xl bg-[#23120b] border border-amber-900/40 hover:border-amber-600/40 transition-colors flex flex-col gap-2.5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 p-0.5 shrink-0 flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-[#20100a] flex items-center justify-center font-bold text-amber-400 text-sm">
                      {cust.name.charAt(0)}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-white truncate">{cust.name}</h3>
                    <div className="flex items-center gap-2 text-xs font-mono text-amber-300/80">
                      <Phone className="w-3 h-3 text-amber-400" />
                      <span>{cust.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Loyalty Stars Badge */}
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold font-mono">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>{cust.loyaltyPoints} pts</span>
                </div>
              </div>

              {/* Stats & Quick Bill Action */}
              <div className="pt-2 border-t border-amber-900/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-amber-200/70 font-mono text-[11px]">
                  <span>{cust.totalOrders} visits</span>
                  <span>•</span>
                  <span>Spent: {settings.currencySymbol}{cust.totalSpent.toLocaleString('en-IN')}</span>
                </div>

                <button
                  onClick={() => handleStartBillForCustomer(cust)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-[11px] flex items-center gap-1 active:scale-95 transition-all shadow-sm"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Start Bill</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-[#20110a] border border-amber-900/60 rounded-3xl p-5 shadow-2xl text-stone-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white font-heading">
                New Customer Profile
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-full bg-amber-950 text-amber-300 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-amber-200/80 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Vikram Sharma"
                  className="w-full bg-[#140b07] border border-amber-900/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-amber-200/80 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full bg-[#140b07] border border-amber-900/60 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-amber-200/80 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="vikram@example.com"
                  className="w-full bg-[#140b07] border border-amber-900/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md active:scale-95 transition-all"
              >
                Save Member
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
