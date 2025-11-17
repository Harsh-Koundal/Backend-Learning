import React from "react";
import useNotifications from "../hooks/useNotifications";
import api from "../utils/api";

const Bell = ({ token }) => {
  const { notifications, unreadCount, setNotifications, setUnreadCount } = useNotifications(token);

  const markRead = async (id) => {
    await api.patch(`/api/notifications/${id}/read`);
    setNotifications(prev => prev.map(n => n._id === id ? {...n, isRead: true } : n));
    setUnreadCount(c => Math.max(0, c - 1));
  };

  const markAll = async () => {
    await api.patch("/api/notifications/mark-all-read");
    setNotifications(prev => prev.map(n => ({...n, isRead:true})));
    setUnreadCount(0);
  };

  return (
    <div className="relative">
      <button className="bell">🔔 {unreadCount > 0 && <span className="badge">{unreadCount}</span>}</button>
      <div className="dropdown">
        <div className="flex items-center justify-between">
          <h3>Notifications</h3>
          <button onClick={markAll}>Mark all read</button>
        </div>

        <ul>
          {notifications.map(n => (
            <li key={n._id} className={`p-2 ${n.isRead ? '' : 'bg-blue-50'}`}>
              <div className="flex justify-between">
                <div>
                  <div className="font-semibold">{n.title}</div>
                  <div className="text-sm text-gray-600">{n.body}</div>
                </div>
                {!n.isRead && <button onClick={()=>markRead(n._id)}>Mark read</button>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Bell;
