import { gql } from '@apollo/client';


export const GetDashboardData = gql`
    query GetDashboardData($filters: FiltersDto) {
        getDashboardData(filters: $filters) {
            totalUsers
            newUsers
            activeUsers
            totalReports
            totalEvents
            totalStudentChapters
            reportPie {
                Solved
                UnSolved
            }
            totalVisits {
                thisMonth
                thisWeek
                thisYear
                today
            }
            userVerificationPie {
                Verified
                UnVerified
                Pending
            }
            eventProgress {
                UPCOMING
                HAPPENED
                CANCELLED
            }
            activeUserGrowth {
                current
                growthPercentage
                isPositive
                previous
            }
            eventGrowth {
                current
                growthPercentage
                isPositive
                previous
            }
            reportGrowth {
                current
                growthPercentage
                isPositive
                previous
            }
            userGrowth {
                current
                growthPercentage
                isPositive
                previous
            }
        }
    }
`;