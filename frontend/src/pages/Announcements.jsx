import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import {
  getAnnouncements,
  postAnnouncement,
  deleteAnnouncement,
} from "../services/api";
import { MegaphoneIcon, PlusIcon } from "../components/ui/Icons";

const Announcements = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const isManager = user?.role === "admin" || user?.role === "hr";

  const fetchAnnouncements = async () => {
    try {
      const res = await getAnnouncements();
      if (res.success) setAnnouncements(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await postAnnouncement({ title, content });
      if (res.success) {
        setShowModal(false);
        setTitle("");
        setContent("");
        fetchAnnouncements();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post announcement");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;
    try {
      await deleteAnnouncement(id);
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>Announcements</h1>
          <p>Company-wide updates and notices</p>
        </div>
        {isManager && (
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            <PlusIcon size={16} /> New Announcement
          </button>
        )}
      </div>

      {announcements.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="icon">
              <MegaphoneIcon size={34} />
            </div>
            <p>No announcements yet</p>
          </div>
        </div>
      ) : (
        announcements.map((ann) => (
          <div className="announcement-item" key={ann._id}>
            <div>
              <h4>{ann.title}</h4>
              <p>{ann.content}</p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                flexShrink: 0,
              }}
            >
              <span className="announcement-date">
                {new Date(ann.createdAt).toLocaleDateString()}
              </span>
              {isManager && (
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(ann._id)}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Post Announcement</h2>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handlePost}>
              <div className="form-group">
                <label>Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Announcement title"
                  required
                />
              </div>
              <div className="form-group">
                <label>Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your announcement..."
                  rows={4}
                  required
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Announcements;
