import { VpnConfigItem } from '../types';

const VPN_CONFIGS_KEY = 'chromium_clone_vpn_confs_v2';

const SEED_CONFIGS: VpnConfigItem[] = [
  {
    id: 'vpn_proton_free_nl',
    name: 'ProtonVPN-Free-NL.conf',
    country: 'Netherlands 🇳🇱',
    endpoint: '185.159.157.3:51820',
    content: `[Interface]
PrivateKey = aGVsbG9fd2lyZWd1YXJkX3ByaXZhdGVfa2V5XzIwMjY=
Address = 10.2.0.2/32
DNS = 10.2.0.1

[Peer]
PublicKey = bXVsdmFkX3Byb3RvbnZwbl9wdWJsaWNfa2V5XzIwMjY=
Endpoint = 185.159.157.3:51820
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25`,
  },
  {
    id: 'vpn_mullvad_se',
    name: 'Mullvad-Stockholm-SE.conf',
    country: 'Sweden 🇸🇪',
    endpoint: '193.138.218.74:51820',
    content: `[Interface]
PrivateKey = c3dlZGVuX211bGx2YWRfcHJpdmF0ZV9rZXlfMjAyNg==
Address = 10.64.12.89/32
DNS = 10.64.0.1

[Peer]
PublicKey = c3RvY2tob2xtX3dhcmVndWFyZF9zZXJ2ZXJfcHViXzIwMjY=
Endpoint = 193.138.218.74:51820
AllowedIPs = 0.0.0.0/0`,
  },
];

class WireguardService {
  private configs: VpnConfigItem[] = [];
  private activeInterface: string | null = null;
  private listeners = new Set<() => void>();

  constructor() {
    this.load();
  }

  private load() {
    try {
      const raw = localStorage.getItem(VPN_CONFIGS_KEY);
      if (raw) {
        this.configs = JSON.parse(raw);
        return;
      }
    } catch (e) {
      console.warn(e);
    }
    this.configs = [...SEED_CONFIGS];
    this.save();
  }

  private save() {
    try {
      localStorage.setItem(VPN_CONFIGS_KEY, JSON.stringify(this.configs));
      this.listeners.forEach(cb => cb());
    } catch (e) {
      console.error(e);
    }
  }

  public listConfigs(): string[] {
    return this.configs.map(c => c.name);
  }

  public getConfigs(): VpnConfigItem[] {
    return [...this.configs];
  }

  public importConfig(name: string, content: string): VpnConfigItem {
    const safeName = name.endsWith('.conf') ? name : `${name}.conf`;
    const id = 'vpn_' + Math.random().toString(36).slice(2, 9);
    const item: VpnConfigItem = {
      id,
      name: safeName,
      content,
      endpoint: content.match(/Endpoint\s*=\s*(.+)/)?.[1]?.trim(),
    };
    this.configs.push(item);
    this.save();
    return item;
  }

  public async connect(name: string): Promise<{ interface: string; ip: string; ping: number }> {
    if (this.activeInterface) {
      await this.disconnect();
    }
    const conf = this.configs.find(c => c.name === name);
    if (!conf) throw new Error('ملف إعدادات VPN غير موجود.');

    // Simulate Wireguard handshake
    await new Promise(r => setTimeout(r, 600));
    this.activeInterface = name;
    this.listeners.forEach(cb => cb());

    return {
      interface: name,
      ip: conf.endpoint ? conf.endpoint.split(':')[0] : '10.2.0.2',
      ping: Math.floor(25 + Math.random() * 20),
    };
  }

  public async disconnect(): Promise<boolean> {
    if (!this.activeInterface) return true;
    await new Promise(r => setTimeout(r, 200));
    this.activeInterface = null;
    this.listeners.forEach(cb => cb());
    return true;
  }

  public status(): { connected: boolean; interface: string | null } {
    return {
      connected: this.activeInterface !== null,
      interface: this.activeInterface,
    };
  }

  public wgAvailable(): string {
    return 'WireGuard v1.0.2026 (Go-userspace engine ready)';
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }
}

export const wireguardService = new WireguardService();
