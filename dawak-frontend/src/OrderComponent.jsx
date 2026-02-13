import { useState, useEffect } from 'react';
import { Camera, Trash2, CheckCircle, Upload, Phone, Clock, Truck, PackageCheck, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_STEPS = {
  PENDING: { label: 'Pending', color: 'orange', icon: Clock },
  ACCEPTED: { label: 'Processing', color: 'blue', icon: Package },
  ON_DELIVERY: { label: 'On Way', color: 'purple', icon: Truck },
  DELIVERED: { label: 'Delivered', color: 'green', icon: PackageCheck },
};

function OrderComponent({ onLogout }) {
  const [items, setItems] = useState([]);
  const [submittedOrders, setSubmittedOrders] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    drugName: '',
    quantity: 1,
    notes: '',
    image: null,
    imagePreview: null
  });

  // Load orders from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('dawak_orders');
    if (saved) {
      setSubmittedOrders(JSON.parse(saved));
    }
  }, []);

  // Simulate remote status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSubmittedOrders(prevOrders => {
        const updated = prevOrders.map(order => {
          if (order.status === 'PENDING' && Math.random() > 0.7) return { ...order, status: 'ACCEPTED' };
          if (order.status === 'ACCEPTED' && Math.random() > 0.7) return { ...order, status: 'ON_DELIVERY' };
          if (order.status === 'ON_DELIVERY' && Math.random() > 0.8) return { ...order, status: 'DELIVERED' };
          return order;
        });

        if (JSON.stringify(updated) !== JSON.stringify(prevOrders)) {
          localStorage.setItem('dawak_orders', JSON.stringify(updated));
        }
        return updated;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: previewUrl
      }));
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!formData.drugName) return alert('Please enter a drug name');

    const newItem = {
      id: Date.now(),
      ...formData,
      image: null
    };

    setItems(prev => [newItem, ...prev]);

    setFormData({
      drugName: '',
      quantity: 1,
      notes: '',
      image: null,
      imagePreview: null
    });
  };

  const handleRemoveItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSubmitOrder = () => {
    if (items.length === 0) return alert('Your cart is empty');

    const newOrder = {
      orderId: `ORD-${Date.now().toString().slice(-6)}`,
      timestamp: Date.now(),
      status: 'PENDING',
      items: items
    };

    const updatedOrders = [newOrder, ...submittedOrders];
    setSubmittedOrders(updatedOrders);
    localStorage.setItem('dawak_orders', JSON.stringify(updatedOrders));

    setItems([]);
    alert('Order Sent Successfully!');
  };

  return (
    <div className="container">

      {/* Background Blobs (Reused from App.jsx for consistency) */}
      <div className="bg-blob blob-1" />
      <div className="bg-blob blob-2" />

      <header style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Dawak Pharmacy</h1>
          <p>Pharmacy Portal</p>
        </div>
        <button onClick={onLogout} className="btn btn-secondary">
          Logout
        </button>
      </header>

      {/* Input Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h2>New Order Request</h2>
        <form onSubmit={handleAddToCart}>
          <div className="input-group">
            <label className="input-label">Item / Drug Name</label>
            <input
              type="text"
              name="drugName"
              className="input-field"
              placeholder="e.g. Panadol Extra"
              value={formData.drugName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(100px, 1fr) 2fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Quantity</label>
              <input
                type="number"
                name="quantity"
                className="input-field"
                min="1"
                value={formData.quantity}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Photo (Optional)</label>
              <label className="image-upload-btn">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden-input"
                  onChange={handleImageUpload}
                />
                {formData.imagePreview ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src={formData.imagePreview} style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'cover' }} alt="Preview" />
                    <span style={{ fontSize: '0.85rem' }}>Change</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Camera size={18} />
                    <span style={{ fontSize: '0.85rem' }}>Upload</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
            <Upload size={18} style={{ marginRight: '8px' }} />
            Add to Current Order
          </button>
        </form>
      </motion.div>

      {/* Current Cart */}
      <AnimatePresence>
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ margin: 0 }}>Current Order ({items.length})</h2>
            </div>

            <div className="item-list">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="cart-item"
                >
                  {item.imagePreview ? (
                    <img src={item.imagePreview} className="item-thumb" alt="Drug" />
                  ) : (
                    <div className="item-thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '1.2rem' }}>💊</span>
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{item.drugName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Qty: {item.quantity}</div>
                  </div>
                  <button onClick={() => handleRemoveItem(item.id)} className="btn btn-destructive" style={{ padding: '8px', borderRadius: '50%', width: '36px', height: '36px' }}>
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </div>

            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--card-border)' }}>
              <button
                onClick={handleSubmitOrder}
                className="btn btn-primary"
              >
                <CheckCircle size={18} style={{ marginRight: '8px' }} />
                Submit Order Request
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order History / Status */}
      {submittedOrders.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 style={{ marginBottom: '16px', color: 'var(--text-secondary)', fontSize: '0.8rem', opacity: 0.7 }}>Track Requests</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {submittedOrders.map(order => {
              const statusConfig = STATUS_STEPS[order.status] || STATUS_STEPS.PENDING;
              const StatusIcon = statusConfig.icon;

              const statusColor =
                statusConfig.color === 'green' ? '#4ade80' :
                  statusConfig.color === 'blue' ? '#60a5fa' :
                    statusConfig.color === 'purple' ? '#c084fc' : '#fbbf24';

              return (
                <motion.div
                  key={order.orderId}
                  layout
                  initial={{ scale: 0.98, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="card"
                  style={{ padding: '0', overflow: 'hidden', borderLeft: `4px solid ${statusColor}` }}
                >
                  {/* Order Header */}
                  <div style={{
                    padding: '16px',
                    background: 'rgba(255,255,255,0.02)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid var(--card-border)'
                  }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>#{order.orderId}</span>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      color: statusColor,
                      background: 'rgba(255,255,255,0.05)',
                      padding: '4px 12px',
                      borderRadius: '99px',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                      <StatusIcon size={14} />
                      {statusConfig.label}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div style={{ padding: '16px' }}>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.95rem' }}>
                        <span style={{ fontWeight: '500' }}>{item.drugName}</span>
                        <span style={{ color: 'var(--text-secondary)' }}>x{item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Timestamp Footer */}
                  <div style={{
                    padding: '10px 16px',
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    textAlign: 'right',
                    background: 'rgba(0,0,0,0.2)'
                  }}>
                    {new Date(order.timestamp).toLocaleString()}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      <motion.a
        href="tel:+1234567890"
        className="floating-fab"
        title="Call Support"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Phone size={24} />
      </motion.a>
    </div>
  );
}

export default OrderComponent;
