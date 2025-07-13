import React from 'react';

const ProfilePage: React.FC = () => {
  return (
    <div>
      <h1>Profile Page</h1>

      <section>
        <h2>Hours Played</h2>
        <p>Total hours: [Placeholder for hours]</p>
      </section>

      <section>
        <h2>Recently Played Games</h2>
        <ul>
          <li>[Placeholder Game 1]</li>
          <li>[Placeholder Game 2]</li>
          <li>[Placeholder Game 3]</li>
        </ul>
      </section>

      <section>
        <h2>Favorite Games</h2>
        <p>[Placeholder for favorite games]</p>
      </section>
    </div>
  );
};

export default ProfilePage;