import React, {useState, useEffect} from "react";
import {PageHeader, ListGroup, ListGroupItem} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import {useAppContext} from "../libs/contextLib";
import {onError} from "../libs/errorLib";
import {API} from "aws-amplify";
import "./Home.css";

export default function Home() {
    const [notes, setNotes] = useState([]);
    const {isAuthenticated} = useAppContext();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(async () => {
        if (!isAuthenticated) {
            return;
        }
        try {
            const notes = await loadNotes();
            setNotes(notes);
            setIsLoading(false);

        } catch (e) {
            onError(e);
        }
    }, [isAuthenticated]);

    function loadNotes() {
        return API.get("notes", "/notes");
    }


    function renderNotesList(notes) {
        return [{}].concat(notes).map((note, i) =>
            i !== 0 ? (
                <LinkContainer key={note.noteId} to={`/notes/${note.noteId}`}>
                    <ListGroupItem header={note.content.trim().split("\n")[0]}>
                        {"Created: " + new Date(note.createdAt).toLocaleString()}
                    </ListGroupItem>
                </LinkContainer>
            ) : (
                <LinkContainer key="new" to="/notes/new">
                    <ListGroupItem>
                        <h4>
                            <b>{"\uFF0B"}</b> Create a new note
                        </h4>
                    </ListGroupItem>
                </LinkContainer>
            )
        );
    }

    function renderLander() {
        return (
            <div className="Home">
                <div className="lander">
                    <h1>NS3</h1>
                    <p>Note-taking app based on Scratch by Serverless Stack</p>
                    <p>Anran's first web application on AWS serverless infrastructure</p>

                </div>
            </div>
        );
    }

    function renderNotes() {
        return (
            <div className="notes">
                <PageHeader>Your Notes</PageHeader>
                <ListGroup>
                    {!isLoading && renderNotesList(notes)}
                </ListGroup>
            </div>
        );
    }

    return (
        <div className="Home">
            {isAuthenticated ? renderNotes() : renderLander()}
        </div>
    );

}