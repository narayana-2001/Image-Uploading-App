export default function Sidebar() {
  // -----------------------------------------------------------
  // Temporary hard-coded user object.
  // In a real application, this would come from auth/user context.
  // -----------------------------------------------------------
  const user = {
    name: "John Doe",
    profilePic: "/default.jpeg", // Local image served from /public/default.jpeg
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        
        {/* -------------------------------------------------------
            User Profile Picture
            - Displays user's profile image
            - Includes fallback logic if the image fails to load
          ------------------------------------------------------- */}
        <img
          src={user.profilePic}
          alt="Profile"
          className="profile-pic"
          onError={(e) => {
            // Prevent infinite loop if fallback ALSO fails
            e.currentTarget.onerror = null;

            // Replace with a basic placeholder image
            e.currentTarget.src = "https://via.placeholder.com/100";
          }}
        />

        {/* -------------------------------------------------------
            User Name (clickable)
            - Could later be turned into a link to a profile page
            - Wrapped in <a> so styling/hover effects are easy to apply
          ------------------------------------------------------- */}
        <p className="profile-name">
          <a href="#" className="profile-link">
            {user.name}
          </a>
        </p>

      </div>
    </div>
  );
}
