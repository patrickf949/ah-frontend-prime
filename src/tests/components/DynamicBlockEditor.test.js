import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DynamicBlockEditor from "../../components/articles/DynamicBlockEditor";
import axios from "axios";

jest.mock("axios");
jest.mock("react-quill-new", () => {
  return function DummyQuill(props) {
    return <textarea data-testid="quill" onChange={(e) => props.onChange(e.target.value)} value={props.value} />;
  }
});

describe("DynamicBlockEditor", () => {
  let onChange;

  beforeEach(() => {
    onChange = jest.fn();
    jest.clearAllMocks();
  });

  it("renders with fallback text for invalid JSON", () => {
    render(<DynamicBlockEditor initialBlocks="invalid json" onChange={onChange} />);
    expect(screen.getByText(/invalid json/i)).toBeTruthy();
  });

  it("renders empty state correctly", () => {
    render(<DynamicBlockEditor initialBlocks="[]" onChange={onChange} />);
    expect(screen.getByText(/Start by adding a text or image block below/i)).toBeTruthy();
  });

  it("adds a text block", () => {
    render(<DynamicBlockEditor initialBlocks="[]" onChange={onChange} />);
    fireEvent.click(screen.getByText("+ Add Text"));
    expect(onChange).toHaveBeenCalled();
  });

  it("updates a text block on change", () => {
    const blocks = [{ id: "1", type: "text", content: "Block 1" }];
    render(<DynamicBlockEditor initialBlocks={JSON.stringify(blocks)} onChange={onChange} />);
    const quill = screen.getByTestId("quill");
    fireEvent.change(quill, { target: { value: "Updated Block 1" } });
    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(expect.stringContaining("Updated Block 1"));
  });

  it("handles image click and limit", async () => {
    const { rerender } = render(<DynamicBlockEditor initialBlocks={JSON.stringify([
      {id: "1", type: "image", url: "url1"},
      {id: "2", type: "image", url: "url2"},
      {id: "3", type: "image", url: "url3"},
      {id: "4", type: "image", url: "url4"}
    ])} onChange={onChange} />);
    
    fireEvent.click(screen.getByText("+ Add Image"));
    await waitFor(() => {
      expect(screen.getByText(/Maximum of 4 images allowed per article/i)).toBeTruthy();
    });

    // Verify error clears on valid add image (less than 4)
    rerender(<DynamicBlockEditor initialBlocks="[]" onChange={onChange} />);
    fireEvent.click(screen.getByText("+ Add Image"));
    expect(screen.queryByText(/Maximum of 4 images allowed per article/i)).toBeNull();
  });

  it("handles file change with invalid type", async () => {
    const { container } = render(<DynamicBlockEditor initialBlocks="[]" onChange={onChange} />);
    const input = container.querySelector('input[type="file"]');
    
    // create a fake file
    const file = new File(["test"], "test.txt", { type: "text/plain" });
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(screen.getByText(/Only image files are allowed/i)).toBeTruthy();
    });
  });

  it("handles file change with large file", async () => {
    const { container } = render(<DynamicBlockEditor initialBlocks="[]" onChange={onChange} />);
    const input = container.querySelector('input[type="file"]');
    
    const file = new File(["test"], "test.png", { type: "image/png" });
    Object.defineProperty(file, 'size', { value: 600 * 1024 });
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(screen.getByText(/Image size exceeds the 500KB limit/i)).toBeTruthy();
    });
  });

  it("handles file change success", async () => {
    axios.post.mockResolvedValueOnce({ data: { uploadUrl: "http://upload", url: "http://image" } });
    axios.put.mockResolvedValueOnce({});
    
    const { container } = render(<DynamicBlockEditor initialBlocks="[]" onChange={onChange} />);
    const input = container.querySelector('input[type="file"]');
    
    const file = new File(["test"], "test.png", { type: "image/png" });
    Object.defineProperty(file, 'size', { value: 100 * 1024 });
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });
  });

  it("handles file change failure", async () => {
    axios.post.mockRejectedValueOnce(new Error("Upload failed"));
    
    const { container } = render(<DynamicBlockEditor initialBlocks="[]" onChange={onChange} />);
    const input = container.querySelector('input[type="file"]');
    
    const file = new File(["test"], "test.png", { type: "image/png" });
    Object.defineProperty(file, 'size', { value: 100 * 1024 });
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to upload image. Please try again./i)).toBeTruthy();
    });

    // Test alert close
    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);
    await waitFor(() => {
      expect(screen.queryByText(/Failed to upload image. Please try again./i)).toBeNull();
    });
  });
  
  it("can move and remove blocks", () => {
    const blocks = [
      { id: "1", type: "text", content: "Block 1" },
      { id: "2", type: "text", content: "Block 2" }
    ];
    render(<DynamicBlockEditor initialBlocks={JSON.stringify(blocks)} onChange={onChange} />);
    
    const downButtons = screen.getAllByText("Down");
    fireEvent.click(downButtons[0]);
    expect(onChange).toHaveBeenCalled();
    
    const upButtons = screen.getAllByText("Up");
    fireEvent.click(upButtons[1]);
    expect(onChange).toHaveBeenCalled();
    
    const removeButtons = screen.getAllByText("Remove");
    fireEvent.click(removeButtons[0]);
    expect(onChange).toHaveBeenCalled();
  });
});
