import React, { useState, useEffect } from 'react';
import { wireguardService } from '../../services/wireguardService';
import { settingsStore } from '../../services/settingsStore';
import { Shield, ShieldAlert, X, Plus, Activity, Globe, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const VpnModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [configs, setConfigs] = useState<string[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<string>('');
  const [status, setStatus] = useState(wireguardService.status());
  const [loading, setLoading] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importName, setImportName] = useState('');
  const [importContent, setImportContent] = useState('');
  const [connectionDetails, setConnectionDetails] = useState<{ ip: string; ping: number } | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const list = wireguardService.listConfigs();
    setConfigs(list);
    const def = settingsStore.get('vpn.defaultConf') || (list.length > 0 ? list[0] : '');
    setSelectedConfig(def);
    setStatus(wireguardService.status());

    const unsub = wireguardService.subscribe(() => {
      setConfigs(wireguardService.listConfigs());
      setStatus(wireguardService.status());
    });
    return unsub;
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleConnect = async () => {
    setLoading(true);
    try {
      if (status.connected) {
        await wireguardService.disconnect();
        setConnectionDetails(null);
      } else {
        if (!selectedConfig) {
          alert('يرجى اختيار ملف إعدادات أولاً أو استيراد ملف جديد.');
          return;
        }
        const res = await wireguardService.connect(selectedConfig);
        setConnectionDetails({ ip: res.ip, ping: res.ping });
      }
    } catch (err: any) {
      alert('خطأ في اتصال VPN: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importName || !importContent) return;
    wireguardService.importConfig(importName, importContent);
    setImportName('');
    setImportContent('');
    setShowImport(false);
    setConfigs(wireguardService.listConfigs());
  };

  const killSwitch = settingsStore.get('vpn.killSwitch');

  return (
    <div dir="rtl" className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#1c1c1f] border border-[#2f3237] text-slate-100 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2d3034] bg-[#171719]">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${status.connected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">WireGuard VPN Manager</h3>
              <p className="text-[11px] text-slate-400">تشفير وحماية حركة المرور بنفق عالي السرعة</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-[#252528]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Status banner */}
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            status.connected
              ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
              : 'bg-[#141517] border-[#292c30] text-slate-400'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${status.connected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
              <div>
                <div className="text-xs font-bold text-white">
                  {status.connected ? `متصل بالنفق: ${status.interface}` : 'غير متصل بالـ VPN'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {status.connected && connectionDetails
                    ? `عنوان IP الافتراضي: ${connectionDetails.ip} · سرعة الاستجابة: ${connectionDetails.ping}ms`
                    : 'الاتصال المباشر بمزود الخدمة (بدون تشفير WireGuard)'}
                </div>
              </div>
            </div>
            {killSwitch && (
              <span className="text-[10px] bg-rose-500/20 text-rose-300 font-semibold px-2 py-0.5 rounded">
                Kill Switch مفعل
              </span>
            )}
          </div>

          {/* Config selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">اختر خادم النفق (.conf)</label>
            <div className="flex items-center gap-2">
              <select
                disabled={status.connected}
                value={selectedConfig}
                onChange={e => setSelectedConfig(e.target.value)}
                className="flex-1 bg-[#141517] border border-[#303338] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-sky-500 disabled:opacity-50"
              >
                {configs.length === 0 ? (
                  <option value="">لا توجد ملفات إعدادات</option>
                ) : (
                  configs.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))
                )}
              </select>
              <button
                disabled={status.connected}
                onClick={() => setShowImport(true)}
                className="p-2 bg-[#26282c] hover:bg-[#32353a] rounded-xl text-slate-300 hover:text-white disabled:opacity-40"
                title="استيراد إعدادات جديدة"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Import form */}
          {showImport && (
            <form onSubmit={handleImport} className="p-3.5 bg-[#141518] rounded-xl border border-[#333] space-y-2.5">
              <div className="text-xs font-bold text-sky-400">استيراد إعدادات WireGuard (.conf)</div>
              <input
                type="text"
                required
                placeholder="اسم السيرفر (مثال: ProtonVPN-US.conf)"
                value={importName}
                onChange={e => setImportName(e.target.value)}
                className="w-full bg-[#1c1d21] border border-[#303338] rounded-lg px-3 py-1.5 text-xs text-white"
              />
              <textarea
                required
                rows={4}
                placeholder="الصق محتوى ملف [Interface] و [Peer] هنا..."
                value={importContent}
                onChange={e => setImportContent(e.target.value)}
                className="w-full bg-[#1c1d21] border border-[#303338] rounded-lg p-2 text-xs font-mono text-slate-300"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowImport(false)}
                  className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded text-xs"
                >
                  استيراد
                </button>
              </div>
            </form>
          )}

          {/* Action button */}
          <button
            disabled={loading || configs.length === 0}
            onClick={handleToggleConnect}
            className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors ${
              status.connected
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
            } disabled:opacity-50`}
          >
            {loading ? (
              <span>جارٍ المعالجة...</span>
            ) : status.connected ? (
              <span>قطع اتصال VPN</span>
            ) : (
              <span>اتصال آمن بـ WireGuard</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
