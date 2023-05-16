import React from 'react';
import Image from 'next/image';

const WantPlusAnnouncement = () => {
return (
<div className="bg-light py-4">
<div className="container text-center">
<h2 className="mb-4">We're working on Want+!</h2>
<p className="lead mb-4">
We're excited to announce that we're working on Want+, a new feature that will allow you to highlight your posts in people's feeds and reach more users.
</p>
<p className="mb-4">
We are also committed to developing a transparent and reasonable monetization strategy that doesn't compromise the user experience.
</p>
<button className="btn btn-primary btn-lg">Learn more</button>
</div>
</div>
);
};

export default WantPlusAnnouncement;