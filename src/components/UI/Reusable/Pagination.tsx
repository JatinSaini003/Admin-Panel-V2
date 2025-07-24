interface PaginationProps {
    page: number;
    setPage: (page: number) => void;
    hasMore: boolean;
}

const Pagination: React.FC<PaginationProps> = ({ page, setPage, hasMore }) => (
    <div className="flex items-center gap-4 mt-4">
        <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="text-sm px-4 py-1 rounded bg-primary text-white disabled:opacity-50"
        >
            Previous
        </button>
        <span className="text-white">Page {page}</span>
        <button
            disabled={!hasMore}
            onClick={() => setPage(page + 1)}
            className="text-sm px-4 py-1 rounded bg-primary text-white disabled:opacity-50"
        >
            Next
        </button>
    </div>
);

export default Pagination;
