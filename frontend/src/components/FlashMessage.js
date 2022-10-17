import React, { useContext } from "react";
import { Alert, Collapse } from "react-bootstrap";
import { FlashContext } from "./context/FlashProvider";

export default function FlashMessage() {
    const { flashMessage, visible, hideFlash } = useContext(FlashContext);
    return(
        <Collapse in={visible}>
            <div>
                <Alert variant={flashMessage.type || 'info'} dismissible onClose={hideFlash}>
                    {flashMessage.message}
                </Alert>
            </div>
        </Collapse>
    );
}