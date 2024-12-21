import React, { useState, useEffect } from "react";
import { Box, Container, Text } from "@chakra-ui/react";
import Login from "../Components/UserAuth/Login";
import Signup from "../Components/UserAuth/Signup";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [showSignup, setShowSignup] = useState(false); // State to toggle forms

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) navigate("/chats");
  }, [navigate]);

  return (
    <Container
      maxW="xl"
      centerContent
      height="100vh" // Full viewport height to center vertically
      display="flex" // Flexbox to center content
      justifyContent="center" // Center horizontally
      alignItems="center" // Center vertically
      borderRadius="xl"
    >
      <Box
        bg="#00000076"
        w="100%"
        p={4}
        borderRadius="lg"
        color="white"
        borderWidth="1px"
        borderColor="#00000076"
        boxShadow="lg"
      >
        {/* Styled Title */}
        <Text
          fontSize="3xl"
          fontWeight="extrabold"
          color="white"
          mb={6}
          textAlign="center"
          textTransform="uppercase"
          letterSpacing="widest"
          borderBottom="3px solid #6A0DAD"
          pb={2}
        >
          ChatWave
        </Text>
        {showSignup ? <Signup /> : <Login />} {/* Toggle between forms */}
        <Box textAlign="center" mt={4}>
          <Text>
            {showSignup ? (
              <>
                Already have an account?{" "}
                <Text
                  as="span"
                  color="blue.500"
                  cursor="pointer"
                  onClick={() => setShowSignup(false)} // Switch to Login
                >
                  Log in
                </Text>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <Text
                  as="span"
                  color="blue.500"
                  cursor="pointer"
                  onClick={() => setShowSignup(true)} // Switch to Sign Up
                >
                  Sign up
                </Text>
              </>
            )}
          </Text>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
