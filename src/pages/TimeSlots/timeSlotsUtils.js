export const getSlotDurationDiff = () => {
    const sessions = [];
    for (let i = 5; i <= 60; i += 5) {
        sessions.push({ label: `${i} minutes`, value: i });
    }
    return sessions;
};

export const singleDateTimeSlotIntialValues = {
    date: '',
    timeSlots: []
};
export const dateRangeTimeSlotIntialValues = {
    date: '',
    timeSlots: [],
    duration: ''
};

// export const dateRangeTimeSlotIntialValues = {
//     date: [],
//     duration: null,
//     timeSlots: [
//         {
//             from: [new Date()],
//             to: [new Date()]
//         }
//     ]
// };
