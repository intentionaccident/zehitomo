import React from "react";
import Container from "react-bootstrap/esm/Container";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { ImageGroup, State } from "src/State";
import { ImageRack } from "./ImageRack";

export function FavouriteGroupDisplay(): JSX.Element {
    const { groupId }: { groupId: string } = useParams();

    const group = useSelector((state: State) => state.imageGroups.find(group => group.id === groupId));
    const images = useSelector((state: State) => group.imageIds.map(id => state.images[id]));

    return <Container>
        {group.name}
        <ImageRack images={images} />
    </Container>
}
