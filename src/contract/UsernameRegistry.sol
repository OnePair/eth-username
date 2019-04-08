pragma solidity 0.4.25;

contract UsernameRegistry {
    struct UserProfile {
        bool registered;
        address userAddress;
        string profileAddress;

    }

    mapping(string => UserProfile) private userProfileStore;


    function registerUsername(string username, string profileAddress) public {
        registerUsername(username, msg.sender, profileAddress);
    }

    // Register and update a username

    /*
     * TODO: Add registration fee
     */
    function registerUsername(string username, address userAddress, string profileAddress) public {
        UserProfile storage user = userProfileStore[username];

        require(!user.registered, "Username already exists.");

        // Pay the registration fee


        user.registered = true;
        user.userAddress = userAddress;
        user.profileAddress = profileAddress;

    }

    function setUserAddress(string username, address userAddress) public {
        UserProfile storage user = userProfileStore[username];

        // Make sure that the username exists
        require(user.registered, "Username does not exist.");
        require(user.userAddress == msg.sender, "Wrong owner.");

        user.userAddress = userAddress;
    }

    function setProfileAddress(string username, string profileAddress) public {
        UserProfile storage user = userProfileStore[username];

        require(user.registered, "Username does not exist.");
        require(user.userAddress == msg.sender, "Wrong owner.");

        user.profileAddress = profileAddress;
    }

    function getUserAddress(string username) public view returns (address) {
        UserProfile storage user = userProfileStore[username];
        return user.userAddress;
    }

    function getProfileAddress(string username) public view returns (string) {
        UserProfile storage user = userProfileStore[username];
        return user.profileAddress;
    }

    function usernameExists(string username) public view returns (bool) {
        UserProfile storage user = userProfileStore[username];
        return user.registered;
    }
}
