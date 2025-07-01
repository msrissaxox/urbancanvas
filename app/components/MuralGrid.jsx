"use client";
import React from "react";
import Card from "./Card";

export default function MuralGrid({accessToken, user}) {
  //access token and user are passed from Page.js
  return <Card accessToken={accessToken} user={user} />;
}
