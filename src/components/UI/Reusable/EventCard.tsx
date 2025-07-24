interface Event {
    id: string;
    imageId: string;
    name: string;
    addedBy: string;
    startDateTime?: string;
}

interface Props {
    event: Event;
}

const CustomEventCard: React.FC<Props> = ({ event }) => {
    // const navigate = useNavigate();
    const date = event.startDateTime ? event.startDateTime.split("T")[0] : ""

    return (
        <div className="relative group h-[220px] w-[220px] overflow-hidden">
            <img
                src={event.imageId}
                alt={event.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-end p-4">
                <h3 className="text-default text-caption font-semibold">{event.name}</h3>
                <p className="text-muted text-sm">By {event.addedBy}</p>
                <p className="text-muted text-sm">Created on: {date}</p>
            </div>
        </div>
    );
};

export default CustomEventCard;
