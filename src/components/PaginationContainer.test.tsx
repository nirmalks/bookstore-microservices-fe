
import { render, screen } from "@testing-library/react";
import PaginationContainer from "./PaginationContainer";
import { useLoaderData, useLocation, useNavigate } from "react-router";
import userEvent from "@testing-library/user-event";

jest.mock("react-router", () => ({
    useLoaderData: jest.fn(),
    useLocation: jest.fn(),
    useNavigate: jest.fn(),
}));

describe('pagination container test', () => {
    const mockNavigate = jest.fn();
    beforeEach(() => {
        jest.clearAllMocks();

        // Setup default returns for hooks
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
        (useLocation as jest.Mock).mockReturnValue({
            pathname: "/products",
            search: "",
        });
    });
    it('renders the correct number of page buttons', () => {
        (useLoaderData as jest.Mock).mockReturnValue({
            meta: { totalPages: 3, number: 0 }
        })
        render(<PaginationContainer />);
        const buttons = screen.getAllByRole("button");
        expect(buttons).toHaveLength(5);
        expect(screen.getByText("1")).toBeInTheDocument();
        expect(screen.getByText("2")).toBeInTheDocument();
        expect(screen.getByText("3")).toBeInTheDocument();
    })

    it("highlights the active page button", () => {
        (useLoaderData as any).mockReturnValue({
            meta: { totalPages: 3, number: 1 }, // Page 2 (index 1)
        });

        render(<PaginationContainer />);

        const activeBtn = screen.getByText("2");
        expect(activeBtn).toHaveClass("bg-base-300");
    });

    it("navigates to the correct page when a page number is clicked", async () => {
        (useLoaderData as any).mockReturnValue({
            meta: { totalPages: 5, number: 0 },
        });

        render(<PaginationContainer />);

        const pageThreeBtn = screen.getByText("3");
        const user = userEvent.setup();
        await user.click(pageThreeBtn);

        // Should call navigate with zero-based index (3 - 1 = 2)
        expect(mockNavigate).toHaveBeenCalledWith("/products?page=2");
    });

    it("navigates to next page when 'Next' is clicked", async () => {
        (useLoaderData as any).mockReturnValue({
            meta: { totalPages: 5, number: 2 }, // Currently on index 2 (Page 3)
        });

        render(<PaginationContainer />);

        const nextButton = screen.getByText("Next");
        const user = userEvent.setup();
        await user.click(nextButton);

        // Next should be index 3
        expect(mockNavigate).toHaveBeenCalledWith("/products?page=3");
    });

    it("wraps around to the first page when 'Next' is clicked on the last page", async () => {
        (useLoaderData as any).mockReturnValue({
            meta: { totalPages: 5, number: 4 }, // Currently on index 4 (Page 5)
        });

        render(<PaginationContainer />);

        const nextBtn = screen.getByText("Next");
        const user = userEvent.setup();
        await user.click(nextBtn);

        // Wrap around to index 0
        expect(mockNavigate).toHaveBeenCalledWith("/products?page=0");
    });

    it("click 'Prev' should wrap around to last page when clicked on first page", async () => {
        // On the first page (index 0)
        (useLoaderData as jest.Mock).mockReturnValue({
            meta: { totalPages: 5, number: 0 },
        });

        render(<PaginationContainer />);

        const prevBtn = screen.getByText("Prev");
        const user = userEvent.setup();
        await user.click(prevBtn);

        // Should wrap around to last page (index 4)
        expect(mockNavigate).toHaveBeenCalledWith("/products?page=4");
    });

    it("click on pagination buttons maintains existing URL search parameters", async () => {
        (useLocation as jest.Mock).mockReturnValue({
            pathname: "/products",
            search: "?category=books&search=fantasy",
        });
        (useLoaderData as jest.Mock).mockReturnValue({
            meta: { totalPages: 5, number: 0 },
        });

        render(<PaginationContainer />);

        const pageTwoBtn = screen.getByText("2");
        const user = userEvent.setup();
        await user.click(pageTwoBtn);

        // Should append page=1 to existing params
        expect(mockNavigate).toHaveBeenCalledWith(
            "/products?category=books&search=fantasy&page=1"
        );
    });
})