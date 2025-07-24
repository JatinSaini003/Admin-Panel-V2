import {
    useQuery,
    ApolloClient,
} from "@apollo/client";
import { toast } from "react-toastify";
import { ScaleLoader } from "react-spinners";

import { Get_Events, Delete_Event } from "../../queries/eventQueries";

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

    const renderEventCarousel = (status: string, label: string) => {
        const {
            data,
            loading,
            error,
        } = useQuery(Get_Events, {
            variables: {
                input: {
                    status,
                    limit: 10,
                    page: 1,
                },
            },
            notifyOnNetworkStatusChange: true,
        });

        const eventData: EventType[] = data?.getEvents?.events ?? [];
        // console.log(eventData)

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
                        type={`${status.toLowerCase()}-events`}
                        exploreLink={status.toLowerCase()}
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
                {renderEventCarousel("UPCOMING", "Upcoming Events")}
                {renderEventCarousel("HAPPENED", "Completed Events")}
                {renderEventCarousel("CANCELLED", "Cancelled Events")}
            </div>
        </div>
    );
};

export default Events;
