import React from "react";

import { render, cleanup,  waitForElement, waitForElementToBeRemoved, fireEvent, getByText, getByAltText, getByPlaceholderText, getAllByTestId, queryByText, queryByAltText, prettyDOM } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe('Application', () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText('Monday'));

    fireEvent.click(getByText('Tuesday'));
    expect(getByText('Leopold Silvers')).toBeInTheDocument();

  });

  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
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

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    const { container } = render(<Application />);

    // Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    // Click the "Delete" button on the first non-empty appointment.
    const appointment = getAllByTestId(container, 'appointment').find(appointment => queryByAltText(appointment, 'Delete'));
    fireEvent.click(getByAltText(appointment, 'Delete'));
    console.log(prettyDOM(appointment));
    
    // Check that the confirmation message is shown.
    expect(getByText(appointment, 'Confirm')).toBeInTheDocument();

    // Click confirm
    fireEvent.click(getByText(appointment, 'Confirm'));

    // Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, 'Deleting...')).toBeInTheDocument();
    

    // Wait until the element is unmounted
    await waitForElementToBeRemoved(() => getByText(appointment, 'Deleting...'));

    // Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, 'day').find(day => queryByText(day, 'Monday'));
    expect(getByText(day, /2 spots remaining/i)).toBeInTheDocument();

  });

});
