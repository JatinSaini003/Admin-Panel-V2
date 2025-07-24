interface Club {
    id: string;
    imageUrl: string;
    name: string;
}

interface Props {
    club: Club;
}

const CustomClubCard: React.FC<Props> = ({ club }) => {
    return (
        <div className="relative group h-52 w-auto pb-4 cursor-pointer">
            <img
                src={club.imageUrl}
                alt={club.name}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform"
            />
        </div>
    );
}

export default CustomClubCard;
