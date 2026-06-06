import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
const API = 'https://vendorbridge-odooxksv.onrender.com/api';

function App() {
  const [page, setPage] = useState('login');
  const [user, setUser] = useState(null);
  const navigate = (p) => setPage(p);

  if (page === 'login') return <Login navigate={navigate} setUser={setUser} />;
  if (page === 'dashboard') return <Dashboard navigate={navigate} user={user} />;
  if (page === 'vendors') return <Vendors navigate={navigate} />;
  if (page === 'rfq') return <RFQ navigate={navigate} />;
  if (page === 'quotations') return <Quotations navigate={navigate} />;
  if (page === 'approvals') return <Approvals navigate={navigate} />;
  if (page === 'po') return <PurchaseOrder navigate={navigate} />;
  if (page === 'invoice') return <Invoice navigate={navigate} />;
  return <div>Page coming soon...</div>;
}

function Login({ navigate, setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Procurement Officer');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.token) {
        setUser({ name: data.user.name, role: data.user.role });
        navigate('dashboard');
      } else {
        setError(data.error || 'Login failed!');
      }
    } catch (err) {
      setError('Server error! Make sure backend is running.');
    }
  };

  const handleRegister = async () => {
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Admin User', email, password, role })
      });
      const data = await res.json();
      if (data.user) {
        setError('Registered! Now login.');
      } else {
        setError(data.error || 'Registration failed!');
      }
    } catch (err) {
      setError('Server error!');
    }
  };

  return (
    <div style={s.loginBg}>
      <div style={s.loginLeft}>
        <h1 style={{ fontSize: 42, fontWeight: 800, color: '#fff', marginBottom: 16 }}>🏢 VendorBridge</h1>
        <p style={{ fontSize: 18, color: '#c4b5fd', marginBottom: 32 }}>Procurement & Vendor Management ERP</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {['Register & manage vendors', 'Create & compare RFQs', 'Approval workflows', 'Generate POs & Invoices'].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: '#a78bfa', fontSize: 18 }}>✓</span>
              <span style={{ color: '#e2e8f0' }}>{f}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={s.loginCard}>
        <h2 style={{ color: '#1e293b', marginBottom: 6, fontSize: 24, fontWeight: 700 }}>Welcome back</h2>
        <p style={{ color: '#64748b', marginBottom: 24, fontSize: 14 }}>Sign in to your account</p>
        <label style={s.label}>Role</label>
        <select style={s.select} value={role} onChange={e => setRole(e.target.value)}>
          <option>Procurement Officer</option>
          <option>Manager / Approver</option>
          <option>Vendor</option>
          <option>Admin</option>
        </select>
        <label style={s.label}>Email</label>
        <input style={s.input} placeholder="admin@vendor.com" value={email} onChange={e => setEmail(e.target.value)} />
        <label style={s.label}>Password</label>
        <input style={s.input} placeholder="••••••••" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        {error && <p style={s.error}>{error}</p>}
        <button style={s.btnPrimary} onClick={handleLogin}>Sign In →</button>
        <button style={{ ...s.btnPrimary, background: '#f1f5f9', color: '#6d28d9', marginTop: 10 }} onClick={handleRegister}>Register New Account</button>
        <p style={{ color: '#94a3b8', fontSize: 12, textAlign: 'center', marginTop: 12 }}>admin@vendor.com / admin123</p>
      </div>
    </div>
  );
}

function Sidebar({ navigate, active }) {
  const navItems = [
    { label: 'Dashboard', page: 'dashboard', icon: '⊞' },
    { label: 'Vendors', page: 'vendors', icon: '🏭' },
    { label: 'RFQs', page: 'rfq', icon: '📋' },
    { label: 'Quotations', page: 'quotations', icon: '💰' },
    { label: 'Approvals', page: 'approvals', icon: '✅' },
    { label: 'Purchase Orders', page: 'po', icon: '📦' },
    { label: 'Invoice', page: 'invoice', icon: '🧾' },
  ];
  return (
    <div style={s.sidebar}>
      <div style={s.sidebarLogo}>
        <span style={{ fontSize: 22 }}>🏢</span>
        <span style={{ fontWeight: 800, fontSize: 18, color: '#fff' }}>VendorBridge</span>
      </div>
      <div style={{ padding: '8px 12px', marginBottom: 8 }}>
        <p style={{ color: '#a78bfa', fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>MAIN MENU</p>
      </div>
      {navItems.map(n => (
        <button key={n.page} style={{ ...s.navBtn, ...(active === n.page ? s.navBtnActive : {}) }} onClick={() => navigate(n.page)}>
          <span style={{ fontSize: 16 }}>{n.icon}</span>
          <span>{n.label}</span>
        </button>
      ))}
    </div>
  );
}

function Dashboard({ navigate, user }) {
  const cards = [
    { label: 'Pending Approvals', value: 4, color: '#f59e0b', bg: '#451a03', icon: '⏳' },
    { label: 'Active RFQs', value: 7, color: '#818cf8', bg: '#1e1b4b', icon: '📋' },
    { label: 'Purchase Orders', value: 12, color: '#34d399', bg: '#022c22', icon: '📦' },
    { label: 'Invoices Generated', value: 9, color: '#f472b6', bg: '#4a044e', icon: '🧾' },
  ];

  const spendingData = [
    { month: 'Sep', amount: 420000 },
    { month: 'Oct', amount: 380000 },
    { month: 'Nov', amount: 510000 },
    { month: 'Dec', amount: 290000 },
    { month: 'Jan', amount: 640000 },
    { month: 'Feb', amount: 580000 },
  ];

  const vendorData = [
    { name: 'TechCorp', value: 35 },
    { name: 'Office Essentials', value: 25 },
    { name: 'BuildRight', value: 20 },
    { name: 'SwiftLogistics', value: 20 },
  ];

  const COLORS = ['#818cf8', '#34d399', '#f59e0b', '#f472b6'];

  return (
    <div style={s.page}>
      <Sidebar navigate={navigate} active="dashboard" />
      <div style={s.content}>
        <div style={s.topBar}>
          <div>
            <h1 style={s.pageTitle}>Dashboard</h1>
            <p style={{ color: '#94a3b8', fontSize: 14 }}>Welcome back, {user?.name} · {user?.role}</p>
          </div>
          <div style={s.topBarRight}>
            <span style={s.badge2}>🟢 System Online</span>
            <div style={s.avatar}>{user?.name?.[0]}</div>
          </div>
        </div>
        <div style={s.cardGrid}>
          {cards.map(c => (
            <div key={c.label} style={{ ...s.card, background: c.bg, border: `1px solid ${c.color}30` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 8 }}>{c.label}</p>
                  <p style={{ color: c.color, fontSize: 40, fontWeight: 800, margin: 0 }}>{c.value}</p>
                </div>
                <span style={{ fontSize: 28 }}>{c.icon}</span>
              </div>
              <p style={{ color: c.color, fontSize: 12, marginTop: 12 }}>↑ 12% from last month</p>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 24 }}>
          <div style={s.chartBox}>
            <h3 style={{ color: '#f1f5f9', marginBottom: 20, fontSize: 16 }}>📊 Monthly Procurement Spending (₹)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={spendingData}>
                <XAxis dataKey="month" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={v => `₹${v / 1000}k`} />
                <Tooltip formatter={v => [`₹${v.toLocaleString()}`, 'Spending']} contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9' }} />
                <Bar dataKey="amount" fill="#818cf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={s.chartBox}>
            <h3 style={{ color: '#f1f5f9', marginBottom: 20, fontSize: 16 }}>🏭 Vendor Distribution</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={vendorData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }) => `${value}%`} labelLine={false}>
                  {vendorData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9' }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              {vendorData.map((v, i) => (
                <span key={v.name} style={{ fontSize: 11, color: COLORS[i] }}>● {v.name}</span>
              ))}
            </div>
          </div>
        </div>
        <div style={s.recentBox}>
          <h3 style={{ color: '#f1f5f9', marginBottom: 16, fontSize: 16 }}>🕐 Recent Activity</h3>
          {[
            { text: 'RFQ #001 created for Office Supplies', time: '2 mins ago', color: '#818cf8' },
            { text: 'Vendor TechCorp submitted quotation', time: '15 mins ago', color: '#34d399' },
            { text: 'PO #2024-001 approved by Manager', time: '1 hour ago', color: '#f59e0b' },
            { text: 'Invoice #INV-001 sent to vendor', time: '3 hours ago', color: '#f472b6' },
          ].map((a, i) => (
            <div key={i} style={s.activityItem}>
              <span style={{ ...s.activityDot, background: a.color }}></span>
              <span style={{ color: '#cbd5e1', flex: 1 }}>{a.text}</span>
              <span style={{ color: '#475569', fontSize: 12 }}>{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Vendors({ navigate }) {
  const [search, setSearch] = useState('');
  const [vendors, setVendors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', category: '', gst: '', contact: '' });

  useEffect(() => {
    fetch(`${API}/vendors`)
      .then(r => r.json())
      .then(data => setVendors(data))
      .catch(() => setVendors([
        { _id: '1', name: 'TechCorp Solutions', category: 'IT Equipment', gst: '27AABCT1332L1ZG', contact: 'tech@techcorp.com', status: 'Active', rating: '4.5⭐' },
        { _id: '2', name: 'Office Essentials', category: 'Office Supplies', gst: '27AABCO1234L1ZG', contact: 'info@officeessentials.com', status: 'Active', rating: '4.2⭐' },
        { _id: '3', name: 'BuildRight Infra', category: 'Construction', gst: '27AABCB5678L1ZG', contact: 'build@buildright.com', status: 'Inactive', rating: '3.8⭐' },
      ]));
  }, []);

  const addVendor = async () => {
    try {
      const res = await fetch(`${API}/vendors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const newVendor = await res.json();
      setVendors([...vendors, newVendor]);
      setShowForm(false);
      setForm({ name: '', category: '', gst: '', contact: '' });
    } catch (err) {
      alert('Error adding vendor!');
    }
  };

  const filtered = vendors.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={s.page}>
      <Sidebar navigate={navigate} active="vendors" />
      <div style={s.content}>
        <div style={s.topBar}>
          <div>
            <h1 style={s.pageTitle}>Vendor Management</h1>
            <p style={{ color: '#94a3b8', fontSize: 14 }}>{vendors.length} vendors registered</p>
          </div>
          <button style={s.btnPrimary} onClick={() => setShowForm(!showForm)}>+ Add Vendor</button>
        </div>

        {showForm && (
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 24, marginBottom: 20 }}>
            <h3 style={{ color: '#f1f5f9', marginBottom: 16 }}>Add New Vendor</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <input style={s.formInput} placeholder="Vendor Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <input style={s.formInput} placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
              <input style={s.formInput} placeholder="GST Number" value={form.gst} onChange={e => setForm({ ...form, gst: e.target.value })} />
              <input style={s.formInput} placeholder="Contact Email" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} />
            </div>
            <button style={{ ...s.btnPrimary, marginTop: 12 }} onClick={addVendor}>Save Vendor</button>
          </div>
        )}

        <input style={s.searchInput} placeholder="🔍  Search vendors..." value={search} onChange={e => setSearch(e.target.value)} />
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>{['Name', 'Category', 'GST Number', 'Contact', 'Rating', 'Status'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map(v => (
                <tr key={v._id} style={s.tr}>
                  <td style={s.td}><strong style={{ color: '#f1f5f9' }}>{v.name}</strong></td>
                  <td style={s.td}><span style={s.tag}>{v.category}</span></td>
                  <td style={s.td}>{v.gst}</td>
                  <td style={s.td}>{v.contact}</td>
                  <td style={s.td}>{v.rating || '4.0⭐'}</td>
                  <td style={s.td}><span style={{ ...s.badge, background: v.status === 'Active' ? '#065f46' : '#7f1d1d', color: v.status === 'Active' ? '#6ee7b7' : '#fca5a5' }}>{v.status || 'Active'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function RFQ({ navigate }) {
  const [rfqs, setRfqs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', product: '', qty: '', deadline: '', vendors: '' });

  useEffect(() => {
    fetch(`${API}/rfq`)
      .then(r => r.json())
      .then(data => setRfqs(data))
      .catch(() => setRfqs([
        { _id: '1', title: 'Office Laptops Q1', product: 'Laptops', qty: 20, deadline: '2024-02-15', vendors: 'TechCorp', status: 'Open' },
        { _id: '2', title: 'Office Furniture', product: 'Chairs', qty: 50, deadline: '2024-02-20', vendors: 'Office Essentials', status: 'Open' },
      ]));
  }, []);

  const addRFQ = async () => {
    try {
      const res = await fetch(`${API}/rfq`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const newRFQ = await res.json();
      setRfqs([...rfqs, newRFQ]);
      setShowForm(false);
      setForm({ title: '', product: '', qty: '', deadline: '', vendors: '' });
    } catch (err) {
      alert('Error creating RFQ!');
    }
  };

  return (
    <div style={s.page}>
      <Sidebar navigate={navigate} active="rfq" />
      <div style={s.content}>
        <div style={s.topBar}>
          <div>
            <h1 style={s.pageTitle}>RFQ Management</h1>
            <p style={{ color: '#94a3b8', fontSize: 14 }}>Request for Quotations</p>
          </div>
          <button style={s.btnPrimary} onClick={() => setShowForm(!showForm)}>+ Create RFQ</button>
        </div>

        {showForm && (
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 24, marginBottom: 20 }}>
            <h3 style={{ color: '#f1f5f9', marginBottom: 16 }}>Create New RFQ</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <input style={s.formInput} placeholder="RFQ Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              <input style={s.formInput} placeholder="Product" value={form.product} onChange={e => setForm({ ...form, product: e.target.value })} />
              <input style={s.formInput} placeholder="Quantity" value={form.qty} onChange={e => setForm({ ...form, qty: e.target.value })} />
              <input style={s.formInput} placeholder="Deadline (YYYY-MM-DD)" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
              <input style={s.formInput} placeholder="Assigned Vendors" value={form.vendors} onChange={e => setForm({ ...form, vendors: e.target.value })} />
            </div>
            <button style={{ ...s.btnPrimary, marginTop: 12 }} onClick={addRFQ}>Save RFQ</button>
          </div>
        )}

        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>{['Title', 'Product', 'Quantity', 'Deadline', 'Vendors', 'Status', 'Action'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {rfqs.map(r => (
                <tr key={r._id} style={s.tr}>
                  <td style={s.td}><strong style={{ color: '#f1f5f9' }}>{r.title}</strong></td>
                  <td style={s.td}>{r.product}</td>
                  <td style={s.td}>{r.qty}</td>
                  <td style={s.td}>{r.deadline}</td>
                  <td style={s.td}>{r.vendors}</td>
                  <td style={s.td}><span style={{ ...s.badge, background: r.status === 'Open' ? '#065f46' : '#1e3a5f', color: r.status === 'Open' ? '#6ee7b7' : '#93c5fd' }}>{r.status}</span></td>
                  <td style={s.td}><button style={s.btnSm} onClick={() => navigate('quotations')}>View Quotes</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Quotations({ navigate }) {
  const quotes = [
    { vendor: 'TechCorp Solutions', price: 85000, delivery: '7 days', rating: '4.5⭐', tax: 15300, total: 100300 },
    { vendor: 'DigiWorld', price: 78000, delivery: '10 days', rating: '4.2⭐', tax: 14040, total: 92040 },
    { vendor: 'SmartTech', price: 92000, delivery: '5 days', rating: '4.8⭐', tax: 16560, total: 108560 },
  ];
  const lowest = Math.min(...quotes.map(q => q.total));
  return (
    <div style={s.page}>
      <Sidebar navigate={navigate} active="quotations" />
      <div style={s.content}>
        <div style={s.topBar}>
          <div>
            <h1 style={s.pageTitle}>Quotation Comparison</h1>
            <p style={{ color: '#94a3b8', fontSize: 14 }}>RFQ: Office Laptops Q1 — 3 quotes received</p>
          </div>
        </div>
        <div style={{ background: '#1e1b4b', border: '1px solid #3730a3', borderRadius: 10, padding: '12px 16px', marginBottom: 20 }}>
          <p style={{ color: '#a5b4fc', margin: 0 }}>💡 Green row = lowest price. Click Select to proceed to approval.</p>
        </div>
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>{['Vendor', 'Base Price', 'Tax (18%)', 'Total', 'Delivery', 'Rating', 'Action'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {quotes.map(q => (
                <tr key={q.vendor} style={{ background: q.total === lowest ? '#052e16' : '' }}>
                  <td style={s.td}>
                    <strong style={{ color: '#f1f5f9' }}>{q.vendor}</strong>
                    {q.total === lowest && <span style={{ ...s.badge, background: '#065f46', color: '#6ee7b7', marginLeft: 8 }}>🏆 Lowest</span>}
                  </td>
                  <td style={s.td}>₹{q.price.toLocaleString()}</td>
                  <td style={s.td}>₹{q.tax.toLocaleString()}</td>
                  <td style={{ ...s.td, fontWeight: 700, color: q.total === lowest ? '#6ee7b7' : '#f1f5f9' }}>₹{q.total.toLocaleString()}</td>
                  <td style={s.td}>{q.delivery}</td>
                  <td style={s.td}>{q.rating}</td>
                  <td style={s.td}><button style={s.btnSm} onClick={() => navigate('approvals')}>Select →</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Approvals({ navigate }) {
  const [status, setStatus] = useState({});
  const requests = [
    { id: 'APR001', rfq: 'Office Laptops Q1', vendor: 'DigiWorld', amount: '₹92,040', requestedBy: 'John Doe', date: '2024-02-01' },
    { id: 'APR002', rfq: 'Office Furniture', vendor: 'Office Essentials', amount: '₹45,000', requestedBy: 'Jane Smith', date: '2024-02-02' },
  ];
  return (
    <div style={s.page}>
      <Sidebar navigate={navigate} active="approvals" />
      <div style={s.content}>
        <div style={s.topBar}>
          <div>
            <h1 style={s.pageTitle}>Approval Workflow</h1>
            <p style={{ color: '#94a3b8', fontSize: 14 }}>{requests.length} requests pending</p>
          </div>
        </div>
        {requests.map(r => (
          <div key={r.id} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 24, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ color: '#818cf8', fontWeight: 700, fontSize: 13 }}>{r.id}</span>
                  <span style={{ ...s.badge, background: '#1e1b4b', color: '#a5b4fc' }}>Pending Review</span>
                </div>
                <h3 style={{ color: '#f1f5f9', margin: 0, marginBottom: 6 }}>{r.rfq}</h3>
                <p style={{ color: '#94a3b8', margin: 0, fontSize: 14 }}>
                  🏭 {r.vendor} &nbsp;|&nbsp; 💰 <strong style={{ color: '#34d399' }}>{r.amount}</strong> &nbsp;|&nbsp; 👤 {r.requestedBy} &nbsp;|&nbsp; 📅 {r.date}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {status[r.id] ? (
                  <span style={{ ...s.badge, background: status[r.id] === 'Approved' ? '#065f46' : '#7f1d1d', color: status[r.id] === 'Approved' ? '#6ee7b7' : '#fca5a5', fontSize: 14, padding: '10px 20px' }}>
                    {status[r.id] === 'Approved' ? '✅' : '❌'} {status[r.id]}
                  </span>
                ) : (
                  <>
                    <button style={{ ...s.btnSm, background: '#065f46', padding: '10px 18px' }} onClick={() => setStatus({ ...status, [r.id]: 'Approved' })}>✅ Approve</button>
                    <button style={{ ...s.btnSm, background: '#7f1d1d', padding: '10px 18px' }} onClick={() => setStatus({ ...status, [r.id]: 'Rejected' })}>❌ Reject</button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        <button style={{ ...s.btnPrimary, marginTop: 8, width: 'auto' }} onClick={() => navigate('po')}>Generate Purchase Order →</button>
      </div>
    </div>
  );
}

function PurchaseOrder({ navigate }) {
  const po = { poNumber: 'PO-2024-0042', date: '2024-02-01', vendor: 'DigiWorld', items: [{ name: 'Laptops', qty: 20, price: 78000, total: 78000 }], tax: 14040, grandTotal: 92040 };
  return (
    <div style={s.page}>
      <Sidebar navigate={navigate} active="po" />
      <div style={s.content}>
        <div style={s.topBar}>
          <h1 style={s.pageTitle}>Purchase Order</h1>
          <span style={{ ...s.badge, background: '#065f46', color: '#6ee7b7', padding: '8px 16px', fontSize: 13 }}>✅ Approved</span>
        </div>
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 32, maxWidth: 750 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid #334155' }}>
            <div>
              <h2 style={{ color: '#818cf8', margin: 0, fontSize: 24 }}>🏢 VendorBridge</h2>
              <p style={{ color: '#94a3b8', margin: 0 }}>Procurement & Vendor Management ERP</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h3 style={{ color: '#f1f5f9', margin: 0 }}>PURCHASE ORDER</h3>
              <p style={{ color: '#818cf8', fontWeight: 700, margin: '4px 0' }}>{po.poNumber}</p>
              <p style={{ color: '#94a3b8', margin: 0 }}>Date: {po.date}</p>
            </div>
          </div>
          <p style={{ color: '#94a3b8', marginBottom: 20 }}>Vendor: <strong style={{ color: '#f1f5f9' }}>{po.vendor}</strong></p>
          <table style={s.table}>
            <thead><tr>{['Item', 'Qty', 'Unit Price', 'Total'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
            <tbody>
              {po.items.map(i => (
                <tr key={i.name}>
                  <td style={s.td}>{i.name}</td>
                  <td style={s.td}>{i.qty}</td>
                  <td style={s.td}>₹{i.price.toLocaleString()}</td>
                  <td style={s.td}>₹{i.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ textAlign: 'right', marginTop: 20, paddingTop: 16, borderTop: '1px solid #334155' }}>
            <p style={{ color: '#94a3b8' }}>Tax (18%): ₹{po.tax.toLocaleString()}</p>
            <h3 style={{ color: '#34d399', fontSize: 22 }}>Grand Total: ₹{po.grandTotal.toLocaleString()}</h3>
          </div>
          <button style={{ ...s.btnPrimary, marginTop: 16, width: 'auto' }} onClick={() => navigate('invoice')}>Generate Invoice →</button>
        </div>
      </div>
    </div>
  );
}

function Invoice({ navigate }) {
  const inv = { invoiceNumber: 'INV-2024-0042', poNumber: 'PO-2024-0042', date: '2024-02-01', vendor: 'DigiWorld', items: [{ name: 'Laptops', qty: 20, price: 78000, total: 78000 }], tax: 14040, grandTotal: 92040 };
  return (
    <div style={s.page}>
      <Sidebar navigate={navigate} active="invoice" />
      <div style={s.content}>
        <div style={s.topBar}>
          <h1 style={s.pageTitle}>Invoice</h1>
          <div style={{ display: 'flex', gap: 12 }}>
            <button style={{ ...s.btnPrimary, width: 'auto' }} onClick={() => window.print()}>🖨️ Print Invoice</button>
            <button style={{ ...s.btnPrimary, width: 'auto', background: 'linear-gradient(135deg, #065f46, #047857)' }}>📧 Send via Email</button>
          </div>
        </div>
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 32, maxWidth: 750 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid #334155' }}>
            <div>
              <h2 style={{ color: '#818cf8', margin: 0, fontSize: 24 }}>🏢 VendorBridge</h2>
              <p style={{ color: '#94a3b8', margin: 0 }}>Procurement & Vendor Management ERP</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h3 style={{ color: '#f1f5f9', margin: 0 }}>INVOICE</h3>
              <p style={{ color: '#818cf8', fontWeight: 700, margin: '4px 0' }}>{inv.invoiceNumber}</p>
              <p style={{ color: '#94a3b8', margin: 0 }}>PO Ref: {inv.poNumber}</p>
              <p style={{ color: '#94a3b8', margin: 0 }}>Date: {inv.date}</p>
            </div>
          </div>
          <p style={{ color: '#94a3b8', marginBottom: 20 }}>Vendor: <strong style={{ color: '#f1f5f9' }}>{inv.vendor}</strong></p>
          <table style={s.table}>
            <thead><tr>{['Item', 'Qty', 'Unit Price', 'Total'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
            <tbody>
              {inv.items.map(i => (
                <tr key={i.name}>
                  <td style={s.td}>{i.name}</td>
                  <td style={s.td}>{i.qty}</td>
                  <td style={s.td}>₹{i.price.toLocaleString()}</td>
                  <td style={s.td}>₹{i.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ textAlign: 'right', marginTop: 20, paddingTop: 16, borderTop: '1px solid #334155' }}>
            <p style={{ color: '#94a3b8' }}>Tax (18%): ₹{inv.tax.toLocaleString()}</p>
            <h3 style={{ color: '#34d399', fontSize: 22 }}>Grand Total: ₹{inv.grandTotal.toLocaleString()}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  loginBg: { minHeight: '100vh', background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 60, padding: 40 },
  loginLeft: { maxWidth: 420, flex: 1 },
  loginCard: { background: '#fff', padding: 40, borderRadius: 20, width: 380, boxShadow: '0 25px 60px rgba(0,0,0,0.4)' },
  label: { display: 'block', color: '#475569', fontSize: 13, fontWeight: 600, marginBottom: 6 },
  select: { width: '100%', padding: '11px 14px', marginBottom: 16, borderRadius: 8, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#1e293b', fontSize: 14, boxSizing: 'border-box' },
  input: { width: '100%', padding: '11px 14px', marginBottom: 16, borderRadius: 8, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#1e293b', fontSize: 14, boxSizing: 'border-box' },
  btnPrimary: { width: '100%', padding: '12px 20px', background: 'linear-gradient(135deg, #6d28d9, #4f46e5)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, cursor: 'pointer', fontWeight: 700 },
  error: { color: '#dc2626', fontSize: 13, marginBottom: 10 },
  page: { display: 'flex', minHeight: '100vh', background: '#0f172a' },
  sidebar: { width: 240, background: 'linear-gradient(180deg, #1e1b4b 0%, #0f172a 100%)', padding: '24px 12px', display: 'flex', flexDirection: 'column', borderRight: '1px solid #1e293b' },
  sidebarLogo: { display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px', marginBottom: 28 },
  navBtn: { display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', color: '#94a3b8', padding: '11px 14px', textAlign: 'left', cursor: 'pointer', fontSize: 14, marginBottom: 4, borderRadius: 8, width: '100%' },
  navBtnActive: { background: 'linear-gradient(135deg, #4f46e5, #6d28d9)', color: '#fff' },
  content: { flex: 1, padding: 32, overflowY: 'auto' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  topBarRight: { display: 'flex', alignItems: 'center', gap: 12 },
  pageTitle: { color: '#f1f5f9', fontSize: 26, fontWeight: 800, margin: 0, marginBottom: 4 },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 },
  card: { borderRadius: 12, padding: 20 },
  chartBox: { background: '#1e293b', borderRadius: 12, padding: 20, border: '1px solid #334155' },
  recentBox: { background: '#1e293b', borderRadius: 12, padding: 20, border: '1px solid #334155' },
  activityItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #1e293b' },
  activityDot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
  badge: { padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  badge2: { background: '#022c22', color: '#34d399', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600 },
  avatar: { width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #6d28d9, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 },
  searchInput: { width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid #334155', background: '#1e293b', color: '#f1f5f9', fontSize: 14, marginBottom: 20, boxSizing: 'border-box' },
  formInput: { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#f1f5f9', fontSize: 14, boxSizing: 'border-box' },
  tableWrap: { borderRadius: 12, overflow: 'hidden', border: '1px solid #334155' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#1e293b' },
  th: { padding: '13px 16px', background: '#0f172a', color: '#64748b', textAlign: 'left', fontSize: 12, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' },
  td: { padding: '13px 16px', color: '#cbd5e1', borderBottom: '1px solid #1e293b', fontSize: 14 },
  tr: { transition: 'background 0.15s' },
  tag: { background: '#1e1b4b', color: '#a5b4fc', padding: '3px 10px', borderRadius: 6, fontSize: 12 },
  btnSm: { padding: '6px 14px', background: 'linear-gradient(135deg, #6d28d9, #4f46e5)', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontWeight: 600 },
};

export default App;