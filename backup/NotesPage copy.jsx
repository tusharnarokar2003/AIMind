// src/pages/NotesPage/NotesPage.jsx
import { useEffect, useState } from "react";
import "./NotesPage.css";
import { supabase } from "../../supabaseClient";
import Navbar from "../../components/Navbar";



export default function NotesPage() {
  // -------------------------
  // STATE VARIABLES
  // -------------------------
  const [notes, setNotes] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sortType, setSortType] = useState("newest");
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [noteText, setNoteText] = useState("");
  const [comment, setComment] = useState("");
 
  const [loading, setLoading] = useState(false);

  // Color palette for notes
  const colors = ["yellow", "green", "blue", "pink", "orange"];

  // Function to get random color for a note
  const getRandomColor = (id) => {
    // Use note ID to consistently assign same color
    return colors[id % colors.length];
  };

  // -----------------------
  // FORMAT DATE
  // -----------------------
  function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleString();
  }

  // -----------------------
  // LOAD NOTES FROM SUPABASE
  // -----------------------
  async function loadNotes() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("journal")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        alert("Error loading notes from database");
        return;
      }

      setNotes(data || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotes();
  }, []);

  // -----------------------
  // OPEN MODAL (ADD)
  // -----------------------
  function openAddModal() {
    setEditId(null);
    setNoteText("");
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
    setNoteText(n.noteText);
    setComment(n.comment || "");
    setShowModal(true);
  }

  // -----------------------
  // SAVE NOTE (ADD or UPDATE) → SUPABASE
  // -----------------------
  async function saveNote(e) {
    e.preventDefault();

    if (!noteText.trim()) {
      alert("Note text is required");
      return;
    }

    try {
      setLoading(true);

      if (editId) {
        // UPDATE
        const { error } = await supabase
          .from("journal")
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
        const { error } = await supabase.from("journal").insert([
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
      await loadNotes();
    } finally {
      setLoading(false);
    }
  }

  // -----------------------
  // DELETE → SUPABASE
  // -----------------------
  async function deleteNote(id) {
    if (!window.confirm("Delete this note?")) return;

    try {
      setLoading(true);
      const { error } = await supabase.from("journal").delete().eq("id", id);
      if (error) {
        console.error(error);
        alert("Error deleting note");
        return;
      }
      setNotes((prev) => prev.filter((n) => n.id !== id));
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
        .from("journal")
        .update({ favorite: newValue })
        .eq("id", id);

      if (error) {
        console.error(error);
        alert("Error updating favorite");
        return;
      }

      setNotes((prev) =>
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
    <div className="notes-wrapper">
      <Navbar /> 

      
      <div className="notes-page">
        {/* HEADER */}
        <div className="page-header">
          <h1 className="page-title">
            <i className="fas fa-sticky-note"></i> .
          </h1>

          <div className="page-actions">
            <button className="btn btn-secondary" onClick={toggleDarkMode}>
              <i className="fas fa-moon"></i> Dark Mode
            </button>

            <button className="btn btn-primary" onClick={openAddModal}>
              <i className="fas fa-plus"></i> Add
            </button>
          </div>
        </div>

        {/* FILTERS */}
        <div className="filters-section">
          <div className="filter-row">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search ..."
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

        {/* NOTES GRID */}
        {filtered.length === 0 && !loading ? (
          <div className="empty-state">
            <i className="fas fa-sticky-note"></i>
            <h3>No Journal Yet</h3>
            <button className="btn btn-primary" onClick={openAddModal}>
              Create First Journal
            </button>
          </div>
        ) : (
          <div className="notes-grid">
            {filtered.map((note) => (
              <div 
                key={note.id} 
                className={`note-card ${getRandomColor(note.id)}`}
              >
                <div className="note-header">
                  <div className="note-actions-menu">
                    <button
                      className="note-action-btn favorite-btn"
                      onClick={() => toggleFavorite(note.id)}
                    >
                      <i
                        className={`fas fa-star${
                          note.favorite ? "" : "-o"
                        }`}
                      ></i>
                    </button>

                    <button
                      className="note-expand-btn"
                      onClick={() => openEditModal(note.id)}
                    >
                      <i className="fas fa-plus"></i>
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

                {/* Hidden action buttons - shown on hover */}
                <div className="note-hover-actions">
                  <button
                    className="note-action-btn-small"
                    onClick={() => openEditModal(note.id)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>

                  <button
                    className="note-action-btn-small"
                    onClick={() => deleteNote(note.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
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
              <h2>{editId ? "Edit Note" : "Add New "}</h2>

              <form onSubmit={saveNote}>
                <label>Note</label>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  required
                ></textarea>

                <label>Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>

                <br />

                <button className="btn btn-primary" style={{ width: "100%" }}>
                  {editId ? "Update Note" : "Save Note"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}