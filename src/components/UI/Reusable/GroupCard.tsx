import CollageLogo from "../../../assets/img/CollageLogo.png";

interface Group {
    name: string;
    college: string;
    totalUsers: number;
    photoId?: string;
}

const CustomGroupCard: React.FC<{ college: Group }> = ({ college }) => {
    return (
        <div className="relative group h-[200px] w-[190px] bg-background-light border border-background-light flex flex-col items-center pt-3">
            <img src={college.photoId || CollageLogo} alt="logo" className="h-[100px] w-[100px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col items-center justify-end p-4">
                <h3 className="text-sm text-white font-medium">{college.name}</h3>
                <p className="text-xs text-muted">{college.college}</p>
                <p className="text-xs text-muted">Members: {college.totalUsers}</p>
            </div>
        </div>
    );
};

export default CustomGroupCard;
