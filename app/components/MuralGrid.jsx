"use client";
import React from "react";
// import ImageUploading from 'react-images-uploading';
import Card from "./Card";

export default function MuralGrid({accessToken, user}) {
  return <Card accessToken={accessToken} user={user} />;
}
