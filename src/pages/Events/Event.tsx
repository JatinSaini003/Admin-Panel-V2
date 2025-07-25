import {
    useQuery,
    ApolloClient,
} from "@apollo/client";
import { toast } from "react-toastify";
import { ScaleLoader } from "react-spinners";

import { Get_Events, Delete_Event, Get_User_Requested_Events } from "../../queries/eventQueries";

import {
    CreateItem,
    EventCard,
    Carousel,
} from "../../components/UI/Reusable";

const EVENT_STATUSES = ["UPCOMING", "HAPPENED", "CANCELLED"];

type EventType = {
    id: string;
    name: string;
    imageId: string;
    addedBy: string;
    scheduleTime?: string;
};


export const handleEventDelete = async (id: string, client: ApolloClient<object>, refetch: () => Promise<void>) => {
    try {
        const response = await client.mutate({
            mutation: Delete_Event,
            variables: {
                input: { id },
            },
            refetchQueries: EVENT_STATUSES.map((status) => ({
                query: Get_Events,
                variables: {
                    input: {
                        status,
                        limit: 10,
                        page: 1,
                    },
                },
            })),
        });

        if (response?.data?.deleteEvent?.id) {
            toast.success("Event deleted successfully");
            if (refetch) await refetch();
        }
    } catch (err) {
        toast.error("Failed to delete event");
    }
};


const Events = () => {

    const renderEventCarousel = (type: string, status: string, label: string) => {
        const variables = {
            input: {
                status,
                limit: 10,
                page: 1,
            },
        };

        //Approved
        const {
            data: approvedData,
            loading: loadingApproved,
            error: errorApproved,
        } = useQuery(Get_Events, {
            variables,
            skip: type !== "Approved",
            notifyOnNetworkStatusChange: true,
        });
        // console.log("Approved : ", approvedData)

        // Pending query
        const {
            data: pendingData,
            loading: loadingPending,
            error: errorPending,
        } = useQuery(Get_User_Requested_Events, {
            variables: { input: { limit: 10, page: 1 } },
            skip: type !== "Pending",
            notifyOnNetworkStatusChange: true,
        });
        // console.log(pendingData)

        // Select based on type
        const data = type === "Approved" ? approvedData : pendingData;
        const loading = type === "Approved" ? loadingApproved : loadingPending;
        const error = type === "Approved" ? errorApproved : errorPending;

        const eventData: EventType[] = type === "Approved" ? data?.getEvents?.events ?? [] : data?.getApprovalRequestEvents?.events ?? [];
        ;
        // console.log("Event Data : ", eventData)

        if (error) {
            return (
                <p className="text-error p-8 text-description-regular">
                    Error fetching Events
                </p>
            );
        }

        return (
            <section>
                <h1 className="text-[#FFFFFF] font-Gilroy text-[20px] pb-3">{label}</h1>
                {loading ? (
                    <div className="pt-4 min-h-[250px] flex justify-center items-center">
                        <ScaleLoader color="#0070FF" />
                    </div>
                ) : eventData.length === 0 ? (
                    <p className="text-center text-muted font-semibold">
                        No {label} Available
                    </p>
                ) : (
                    <Carousel
                        items={eventData}
                        renderItem={(event: EventType) => (
                            <EventCard
                                key={event.id}
                                event={event}
                            />
                        )}
                        className="mt-3"
                        type={`${type === "Pending" ? "pending" : status.toLowerCase()}-events`}
                        exploreLink={type === "Pending" ? "approval-pending" : status.toLowerCase()}
                        buttonLabel="See All"
                    />
                )}
            </section>
        );
    };

    return (
        <div className="bg-background-default text-default px-8 min-h-screen">
            <div className="flex flex-col gap-9">
                {/* Create Section */}
                <section>
                    <h1 className="text-[#FFFFFF] font-Gilroy text-[20px] pb-3">
                        Create an Event
                    </h1>
                    <CreateItem name="Plan an Event" variant="events" />
                </section>

                {/* Carousel Sections */}
                {renderEventCarousel("Pending", "UPCOMING", "Student Requested Events")}
                {renderEventCarousel("Approved", "UPCOMING", "Upcoming Events")}
                {renderEventCarousel("Approved", "HAPPENED", "Completed Events")}
                {renderEventCarousel("Approved", "CANCELLED", "Cancelled Events")}
            </div>
        </div>
    );
};

export default Events;
