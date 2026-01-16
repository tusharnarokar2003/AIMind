// src/pages/notesPage/notesPage.jsx  (or your actual path)
import { useEffect, useState } from "react";
import "./notesPage.css";
import { supabase } from "../../supabaseClient"; // 🔴 adjust path if needed

export default function notesPage() {
  // -------------------------
  // STATE VARIABLES
  // -------------------------
  const [notes, setnotes] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sortType, setSortType] = useState("newest");
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  
  const [noteText, setnoteText] = useState("");
  const [comment, setComment] = useState("");
 
  const [loading, setLoading] = useState(false);

  // -----------------------
  // FORMAT DATE
  // -----------------------
  function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleString(); // date + time
  }

  // -----------------------
  // LOAD noteS FROM SUPABASE
  // -----------------------
  async function loadnotes() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("note")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        alert("Error loading notes from database");
        return;
      }

      setnotes(data || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadnotes();
  }, []);

  // -----------------------
  // OPEN MODAL (ADD)
  // -----------------------
  function openAddModal() {
    setEditId(null);
    
    setnoteText("");
    setComment("");
  
    setShowModal(true);
  }

  // -----------------------
  // OPEN MODAL (EDIT)
  // -----------------------
  function openEditModal(id) {
    const n = notes.find((x) => x.id === id);
    if (!n) return;

    setEditId(id);
   
    setnoteText(n.noteText);
    setComment(n.comment || "");
   
    setShowModal(true);
  }

  // -----------------------
  // SAVE note (ADD or UPDATE) → SUPABASE
  // -----------------------
  async function savenote(e) {
    e.preventDefault();

    if (!noteText.trim()) {
      alert("note text is required");
      return;
    }

    try {
      setLoading(true);

      if (editId) {
        // UPDATE
        const { error } = await supabase
          .from("note")
          .update({
            
            noteText,
            comment,
           
          })
          .eq("id", editId);

        if (error) {
          console.error(error);
          alert("Error updating note");
          return;
        }
      } else {
        // INSERT
        const { error } = await supabase.from("note").insert([
          {
            
            noteText,
            comment,
            
            favorite: false,
          },
        ]);

        if (error) {
          console.log("SUPABASE INSERT ERROR:", error);
          alert("Error saving note: " + error.message);
          return;
        }
      }

      setShowModal(false);
      await loadnotes(); // reload list from DB
    } finally {
      setLoading(false);
    }
  }

  // -----------------------
  // DELETE → SUPABASE
  // -----------------------
  async function deletenote(id) {
    if (!window.confirm("Delete this note?")) return;

    try {
      setLoading(true);
      const { error } = await supabase.from("note").delete().eq("id", id);
      if (error) {
        console.error(error);
        alert("Error deleting note");
        return;
      }
      setnotes((prev) => prev.filter((n) => n.id !== id));
    } finally {
      setLoading(false);
    }
  }

  // -----------------------
  // FAVORITE TOGGLE → SUPABASE
  // -----------------------
  async function toggleFavorite(id) {
    const current = notes.find((n) => n.id === id);
    if (!current) return;

    const newValue = !current.favorite;

    try {
      setLoading(true);
      const { error } = await supabase
        .from("note")
        .update({ favorite: newValue })
        .eq("id", id);

      if (error) {
        console.error(error);
        alert("Error updating favorite");
        return;
      }

      // Update local state
      setnotes((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, favorite: newValue } : n
        )
      );
    } finally {
      setLoading(false);
    }
  }

  // -----------------------
  // FILTER + SORT + SEARCH
  // -----------------------
  const filtered = notes
    .filter((n) => {
      if (filter === "recent") {
        const weekAgo = Date.now() - 7 * 86400000;
        return new Date(n.created_at).getTime() > weekAgo;
      }
      if (filter === "favorites") return n.favorite;
      return true;
    })
    .filter((n) =>
      (n.noteText + (n.comment || ""))

        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortType === "newest")
        return new Date(b.created_at) - new Date(a.created_at);
      if (sortType === "oldest")
        return new Date(a.created_at) - new Date(b.created_at);
      return 0;
    });

  // -----------------------
  // DARK MODE
  // -----------------------
  function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
  }

  // -----------------------
  // JSX UI STARTS HERE
  // -----------------------
  return (
    <div className="notes-page">
      {/* HEADER */}
      <div className="page-header">
        <h1 className="page-title">
          <i className="fas fa-sticky-note"></i> My notes
        </h1>

        <div className="page-actions">
          <button className="btn btn-secondary" onClick={toggleDarkMode}>
            <i className="fas fa-moon"></i> Dark Mode
          </button>

          <button className="btn btn-primary" onClick={openAddModal}>
            <i className="fas fa-plus"></i> Add note
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="filters-section">
        <div className="filter-row">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <i className="fas fa-search"></i>
          </div>

          <div className="filter-tags">
            {["all", "recent", "favorites"].map((t) => (
              <span
                key={t}
                className={`filter-tag ${filter === t ? "active" : ""}`}
                onClick={() => setFilter(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            ))}
          </div>

          <select
            className="sort-dropdown"
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
    
          </select>
        </div>
      </div>

      {/* LOADING */}
      {loading && <div className="loading-text">Loading...</div>}

      {/* noteS GRID */}
      {filtered.length === 0 && !loading ? (
        <div className="empty-state">
          <i className="fas fa-sticky-note"></i>
          <h3>No notes Yet</h3>
          <button className="btn btn-primary" onClick={openAddModal}>
            Create First note
          </button>
        </div>
      ) : (
        <div className="notes-grid">
          {filtered.map((note) => (
            <div key={note.id} className="note-card">

              <div className="note-header">
                

                <div className="note-actions-menu">
                  <button
                    className="note-action-btn"
                    onClick={() => toggleFavorite(note.id)}
                  >
                    <i
                      className={`fas fa-star${
                        note.favorite ? "" : "-o"
                      }`}
                    ></i>
                  </button>

                  <button
                    className="note-action-btn"
                    onClick={() => openEditModal(note.id)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>

                  <button
                    className="note-action-btn"
                    onClick={() => deletenote(note.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>

              <div className="note-content">
                <div className="note-text">"{note.noteText}"</div>
                {note.comment && (
                  <div className="note-comment">{note.comment}</div>
                )}
              </div>

              <div className="note-footer">
                {note.created_at && formatDate(note.created_at)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="modal" onClick={() => setShowModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{editId ? "Edit note" : "Add New note"}</h2>

            <form onSubmit={savenote}>
              <label>note</label>
              <textarea
                value={noteText}
                onChange={(e) => setnoteText(e.target.value)}
                required
              ></textarea>

              <label>Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>

              

              <br />

              <button className="btn btn-primary" style={{ width: "100%" }}>
                {editId ? "Update note" : "Save note"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}












