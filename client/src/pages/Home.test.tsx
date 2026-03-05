import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { HomePage } from "./Home";

describe("HomePage", () => {
    it("renders the welcome message", () => {
        render(
            <MemoryRouter>
                <HomePage />
            </MemoryRouter>,
        );
        expect(
            screen.getByText("Welcome on My Favorite Places"),
        ).toBeInTheDocument();
    });

    it("renders a Signin link", () => {
        render(
            <MemoryRouter>
                <HomePage />
            </MemoryRouter>,
        );
        expect(screen.getByText("Signin")).toBeInTheDocument();
    });

    it("renders a Signup link", () => {
        render(
            <MemoryRouter>
                <HomePage />
            </MemoryRouter>,
        );
        expect(screen.getByText("Signup")).toBeInTheDocument();
    });
});
