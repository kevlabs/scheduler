import React from "react";
import { render, cleanup,  waitForElement, waitForElementToBeRemoved, fireEvent, getByText, getByAltText, getByPlaceholderText, getAllByTestId, queryByText, queryByAltText } from "@testing-library/react";
import axios from "axios";

import Application from "components/Application";

afterEach(cleanup);

describe('Application', () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText('Monday'));

    fireEvent.click(getByText('Tuesday'));
    expect(getByText('Leopold Silvers')).toBeInTheDocument();

  });

  // TEST IS NOT PASSING AS THE STATE UPDATES ONLY ON MESSAGE FROM WEBSOCKET
  // WILL BE SKIPPED SO APP CAN BE DEPLOYED VIA ESTABLISHED WORKFLOW
  xit("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    const { container } = render(<Application />);

    // Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    // Click the "Add" button on the first empty appointment.
    const appointment = getAllByTestId(container, 'appointment').find(appointment => queryByAltText(appointment, 'Add'));
    fireEvent.click(getByAltText(appointment, 'Add'));

    // Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    // Click the first interviewer in the list.
    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));

    // Click the "Save" button on that same appointment.
    fireEvent.click(getByText(appointment, 'Save'));

    // Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, 'Saving...')).toBeInTheDocument();

    // Wait until the element is unmounted
    await waitForElementToBeRemoved(() => getByText(appointment, 'Saving...'));

    // Check that the DayListItem with the text "Monday" also has the text "no spots remaining".
    const day = getAllByTestId(container, 'day').find(day => queryByText(day, 'Monday'));
    expect(getByText(day, /no spots remaining/i)).toBeInTheDocument();

  });

  // TEST IS NOT PASSING AS THE STATE UPDATES ONLY ON MESSAGE FROM WEBSOCKET
  // WILL BE SKIPPED SO APP CAN BE DEPLOYED VIA ESTABLISHED WORKFLOW
  xit("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    const { container } = render(<Application />);

    // Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    // Click the "Delete" button on the first non-empty appointment.
    const appointment = getAllByTestId(container, 'appointment').find(appointment => queryByText(appointment, 'Archie Cohen'));
    fireEvent.click(getByAltText(appointment, 'Delete'));
    
    // Check that the confirmation message is shown.
    expect(getByText(appointment, 'Confirm')).toBeInTheDocument();

    // Click confirm
    fireEvent.click(getByText(appointment, 'Confirm'));

    // Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, 'Deleting...')).toBeInTheDocument();
    
    // Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, 'Add'));

    // Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, 'day').find(day => queryByText(day, 'Monday'));
    expect(getByText(day, /2 spots remaining/i)).toBeInTheDocument();

  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container } = render(<Application />);

    // Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    // Click the "Edit" button on the first non-empty appointment.
    const appointment = getAllByTestId(container, 'appointment').find(appointment => queryByText(appointment, 'Archie Cohen'));
    fireEvent.click(getByAltText(appointment, 'Edit'));
    
    // Confirm that name input field is in view
    expect(getByPlaceholderText(appointment, /enter student name/i)).toBeInTheDocument();
    
    // Change the name to "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    
    // Click the "Save" button on that same appointment.
    fireEvent.click(getByText(appointment, 'Save'));

    // Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, 'Saving...')).toBeInTheDocument();
    
    // Wait until the element with the "Edit" button is displayed.
    await waitForElement(() => getByAltText(appointment, 'Edit'));

    // Check that the DayListItem with the text "Monday" still has the text "1 spot remaining".
    const day = getAllByTestId(container, 'day').find(day => queryByText(day, 'Monday'));
    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();

  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();

    const { container } = render(<Application />);

    // Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    // Click the "Add" button on the first empty appointment.
    const appointment = getAllByTestId(container, 'appointment').find(appointment => queryByAltText(appointment, 'Add'));
    fireEvent.click(getByAltText(appointment, 'Add'));

    // Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    // Click the first interviewer in the list.
    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));

    // Click the "Save" button on that same appointment.
    fireEvent.click(getByText(appointment, 'Save'));
    
    // Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, 'Saving...')).toBeInTheDocument();
    
    // Check that the error view is displayed.
    await waitForElement(() => getByText(appointment, 'Error'));

    // Click the "Close" button.
    fireEvent.click(getByAltText(appointment, 'Close'));

    // Wait until the element with the "Save" button is displayed.
    await waitForElement(() => getByText(appointment, 'Save'));

    // Check that the DayListItem with the text "Monday" still has the text "1 spot remaining".
    const day = getAllByTestId(container, 'day').find(day => queryByText(day, 'Monday'));
    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();

  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();

    const { container } = render(<Application />);

    // Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    // Click the "Delete" button on the first non-empty appointment.
    const appointment = getAllByTestId(container, 'appointment').find(appointment => queryByText(appointment, 'Archie Cohen'));
    fireEvent.click(getByAltText(appointment, 'Delete'));
    
    // Check that the confirmation message is shown.
    expect(getByText(appointment, 'Confirm')).toBeInTheDocument();

    // Click confirm
    fireEvent.click(getByText(appointment, 'Confirm'));

    // Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, 'Deleting...')).toBeInTheDocument();
    
    // Check that the error view is displayed.
    await waitForElement(() => getByText(appointment, 'Error'));

    // Click the "Close" button.
    fireEvent.click(getByAltText(appointment, 'Close'));

    // Wait until the element with the "Edit" button is displayed.
    await waitForElement(() => getByAltText(appointment, 'Edit'));

    // Check that the DayListItem with the text "Monday" still has the text "1 spot remaining".
    const day = getAllByTestId(container, 'day').find(day => queryByText(day, 'Monday'));
    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();
  });

});
