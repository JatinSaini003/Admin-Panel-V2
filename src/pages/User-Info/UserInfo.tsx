import InfoTable from "../../components/UI/InfoTable"


function UserInfo() {
    return (
        <div className="pl-8 pr-4">
            <InfoTable limit={100} />
        </div>
    )
}

export default UserInfo