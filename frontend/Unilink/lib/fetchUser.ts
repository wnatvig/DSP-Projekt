import { useAuth } from "@clerk/expo";
import React, { useEffect, useState } from "react";

type User = {
    username: string;
    gender: string;
    languages: string;
    bio?: string;
  };


export const fetchUser = async (userId: string) => {
    try {

      const res = await fetch(`http://ec2-51-20-64-6.eu-north-1.compute.amazonaws.com:3000/users/${userId}`, {
        method: "GET",
        headers: {
        }
      });

      if (!res.ok) {
        throw new Error("Failed to fetch user");
      }

      const data = await res.json();
      if(data.success){
        console.log("Successss");
        console.log(JSON.stringify(data, null, 2));
        return data.data as User;
      }
    } catch (err) {
      console.log("Error fetching user:", err);
    } 
  };