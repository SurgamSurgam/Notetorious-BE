import React from "react";
import { NotesDisplay } from "./NotesDisplay.js";
import { SingleNoteDisplay } from "./SingleNoteDisplay.js";
import AddNoteDisplayContainer from "../../containers/AddNoteDisplayContainer.js";
import axios from 'axios';

export default class Notes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentNoteObj: "",
      toggleNewNote: true,
      toggleViewNoteInfo: false,
      editedNoteObj: '',

      discrepancyBtwnCurrentAndEdited: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    await this.props.fetchNotes();

    let notes = Object.values(this.props.notes.notes).find(
      (note, i) => i === 0
    );

    if (notes) {
      this.setCurrentNotetoFirstNote(notes);
    }
  }

  handleChange = async e => {
    await this.setState({
      currentNoteObj: { ...this.state.currentNoteObj, body: e }
    });
    this.checkDiscrepancyCurrentObjVsEditedObj()
  };

  handleChangeTitle = async e => {
    await this.setState({
      currentNoteObj: { ...this.state.currentNoteObj, title: e.target.value }
    });

    this.checkDiscrepancyCurrentObjVsEditedObj()
  };

  handleToggleNewNote = () => {
    this.props.toggleNewNote(!this.props.notes.generalUtil.toggleNewNote);
  };

  setCurrentNotetoFirstNote = firstNote => {
    this.setState({
      currentNoteObj: { ...firstNote }
    });
    this.handleEditedNoteObj();
  };

  getSelectionDetails = async (e, selectedNoteObj) => {
    await this.setState({
      currentNoteObj: { ...selectedNoteObj, body: selectedNoteObj.body }
    });
    this.handleEditedNoteObj();
  };

  handleToggleViewNoteInfo = () => {
    this.setState({
      toggleViewNoteInfo: !this.state.toggleViewNoteInfo
    });
  };

  handleEditedNoteObj = () => {
    this.setState({
      editedNoteObj: {...this.state.currentNoteObj}
    })
  }

  checkDiscrepancyCurrentObjVsEditedObj = () => {

    if (this.state.currentNoteObj.title !== this.state.editedNoteObj.title || this.state.currentNoteObj.body !== this.state.editedNoteObj.body) {
      this.setState({
        discrepancyBtwnCurrentAndEdited: true
      })
    } else {
      this.setState({
        discrepancyBtwnCurrentAndEdited: false
      })
    }
  }

  handleEditSubmit = e => {
    e.preventDefault();
    axios
      .post(`/api/notes/${+this.state.editedNoteObj.notebook_id}`, this.state.editedNoteObj)
      .then(() => {
        this.setState({
          editedNoteObj: { ...this.state.editedNoteObj, title: "", body: "" }
        });
      })
      .then(() => {
        this.props.fetchNotebooks();
        this.props.fetchNotes();
      });
  };

  handleEditCancel = async () => {
    this.setState({
      currentNoteObj: { ...this.state.editedNoteObj }
    });
  };

  render() {
    // console.log("STATE", this.state);
    // console.log("PROPS", this.props);
    // console.log("PROPS", this.props.location.pathname);
    console.log("STATE Obj", this.state.currentNoteObj);
    console.log("EDITED: ", this.state.editedNoteObj);


    let notes;
    if (this.props.notes.notes) {
      notes = Object.values(this.props.notes.notes).map((note, i) => {
        let updated_at = new Date(note.updated_at);
        let created_at = new Date(note.created_at);

        return (
          <div
            className="allNotesDiv"
            key={note.id}
            onClick={e => this.getSelectionDetails(e, note)}
          >
            <p>
              Id: {note.id}
              <br />
              Title: {note.title}
              <br />
              Body: {note.body}
              <br />
              {note.updated_at
                ? "Updated at " + updated_at
                : "Created at " + created_at}
              <br />
              Parent Notebook: {note.notebook_id}
              <br />
              Favorited:{String(note.favorited)}
            </p>
          </div>
        );
      });
    }

    return (
      <>
        <h1>All Notes</h1>
        {this.props.notes.generalUtil.toggleNewNote ? (
          <AddNoteDisplayContainer />
        ) : (
          <SingleNoteDisplay
            currentNoteObj={this.state.currentNoteObj}
            handleChange={this.handleChange}
            handleChangeTitle={this.handleChangeTitle}
            handleToggleViewNoteInfo={this.handleToggleViewNoteInfo}
            toggleViewNoteInfo={this.state.toggleViewNoteInfo}
            discrepancyBtwnCurrentAndEdited = {this.state.discrepancyBtwnCurrentAndEdited}
            handleEditSubmit={this.handleEditSubmit}
            handleEditCancel={this.handleEditCancel}
          />
        )}
        <NotesDisplay notes={notes} />
      </>
    );
  }
}
