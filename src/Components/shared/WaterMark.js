import React from 'react';

const WaterMark = ({ value }) => {
    return (
        <section className="watermark">
            {new Array(20).fill('_').map((i, index) => (
                <div key={index}>
                    {new Array(6).fill('_').map((i, index) => (
                        <p key={index}>{value}</p>
                    ))}
                </div>
            ))}
        </section>
    );
};

export default WaterMark;
