import React from "react";
import ReactQuill from "react-quill";
import axios from "axios";

class AddNoteDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newNote: { title: "", body: "", notebook_id: "" },
      selectedNotebookId: "",
      selectedNoteId: "",
      allowShowFavorites: true,
    };
    this.handleCancel = this.handleCancel.bind(this);
    this.handleNewNoteChange = this.handleNewNoteChange.bind(this);
  }

  componentDidMount = async () => {
    //Favs>selectedNote>loadingEditor
    if (this.props.noteIdForSelectedNoteFromFavorites && this.state.allowShowFavorites) {

      await this.setState({
        selectedNoteId: this.props.noteIdForSelectedNoteFromFavorites
      });
      if (this.state.selectedNoteId) {
        this.setState({
          newNote: {
            ...this.state.newNote,
            title: this.props.notes.notes[this.state.selectedNoteId].title,
            body: this.props.notes.notes[this.state.selectedNoteId].body
          },
          selectedNotebookId: this.props.notes.notes[this.state.selectedNoteId].notebook_id
        });
      }
    }

    //NB>selectedNote>loadingEditor
    if (this.props.noteIdForSelectedNoteFromNotebook) {
      await this.setState({
        selectedNoteId: this.props.noteIdForSelectedNoteFromNotebook,
        allowShowFavorites: false,
      });
      if (this.allowShowFavorites) {
        if (this.state.selectedNoteId) {
          this.setNotebookSelectedNote();
        }
      }
    }

    if (this.props.fetchNotebooks) {
      await this.props.fetchNotebooks();

      let defaultNotebook = Object.values(this.props.notebooks).find(
        notebook => notebook.is_default === true
      );

      if (this.state.selectedNotebookId) {
        this.setState({
          newNote: {
            ...this.state.newNote,
            notebook_id: +this.state.selectedNotebookId
          }
        });
      } else {
        this.setState({
          newNote: { ...this.state.newNote, notebook_id: +defaultNotebook.id }
        });
      }
    }

    //allows me to listen to when route is hit and what to fire ala CDM.. and it returns an unlisten function that I can fire on CWU.  This function helps to always keep first note showing and not the edited mode (of create newNote) if people don't cancel it.
    this.unlisten = this.props.history.listen((location, action) => {
      this.props.toggleNewNote();
    });
  };

  // needed to
  componentWillUnmount = () => {
    this.unlisten()
    this.setState({
      allowShowFavorites: true
    })
  }

  handleNewNoteChange = e => {
    if (typeof e === "string") {
      this.setState({
        newNote: { ...this.state.newNote, body: e }
      });
    }
    else if (this.props.location.pathname === '/newNote' ){
      this.setState({
        newNote: { ...this.state.newNote, title: e.target.value  }
      });
    }
    else {
      this.setState({
        newNote: { ...this.state.newNote, title: e.target.value }
      });
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    axios
      .post(`/api/notes/${+this.state.newNote.notebook_id}`, this.state.newNote)
      .then(() => {
        this.setState({
          newNote: { ...this.state.newNote, title: "", body: "" }
        });
      })
      .then(() => {
        this.props.fetchNotebooks();
        this.props.fetchNotes();
        this.props.history.push('/notes');
      });
  };

  handleCancel = async () => {
    if (!this.state.selectedNoteId) {
      this.props.toggleNewNote(!this.props.notes.generalUtil.toggleNewNote);
    }

    this.setState({
      newNote: { ...this.state.newNote, title: "", body: "", notebook_id: "" },

    });
  };

  setNotebookSelectedNote = () => {
    let selectedNoteFromNotesFromNB = Object.values(
      this.props.notesFromNB
    ).find(note => note.id === this.state.selectedNoteId);

    this.setState({
      newNote: {
        ...this.state.newNote,
        title: selectedNoteFromNotesFromNB.title,
        body: selectedNoteFromNotesFromNB.body
      },
      selectedNotebookId: selectedNoteFromNotesFromNB.notebook_id
    });
  };

  handleEdit = async e => {
    e.preventDefault();

    await this.setState({
      ...this.state.newNote,
      notebook_id: this.state.selectedNotebookId
    });

    axios
      .patch(
        `/api/notes/${+this.state.selectedNotebookId}/${
          this.state.selectedNoteId
        }`,
        this.state.newNote
      )
      // .then(() => {
      //   this.setState({
      //     newNote: { ...this.state.newNote, title: "", body: "" }
      //   });
      // })
      .then(() => {
        this.props.fetchNotebooks();
        this.props.fetchNotes();
        this.props.fetchAllNotesFromSingleNotebook(
          this.state.selectedNotebookId
        );
      })
      .then(() => {
        this.props.history.push('/notes')
      })
  };

  render() {

    let { newNote, selectedNoteId } = this.state;
    console.log('STATE:',this.state);

    return (
      <div className="newNoteFormDiv">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newNote.title}
          onChange={this.handleNewNoteChange}
          required
        />
        <ReactQuill
          name="body"
          value={newNote.body}
          onChange={this.handleNewNoteChange}
          placeholder="Start writing/editing"
        />
        <button className="CancelAddNoteButton" onClick={this.handleCancel}>
          Clear Note
        </button>
        {!!selectedNoteId ? (
          !!newNote.title  && !!newNote.body  ? (<button className="addNoteButton" onClick={this.handleEdit}>
            Submit Edit
          </button>) : (null)
        ) : (
          <button className="addNoteButton" onClick={this.handleSubmit}>
            Save New Note
          </button>
        )}
      </div>
    );
  }
}

export default AddNoteDisplay;
