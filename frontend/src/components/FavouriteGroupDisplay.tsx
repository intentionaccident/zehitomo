import React from "react";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { State } from "src/State";
import { DeleteFavouritesGroupButton } from "./DeleteFavouritesGroupButton";
import { ImageRack } from "./ImageRack";

export function FavouriteGroupDisplay(): JSX.Element {
    const { groupId }: { groupId: string } = useParams();

    const group = useSelector((state: State) => state.imageGroups.find(group => group.id === groupId));
    const images = useSelector((state: State) => group.imageIds.map(id => state.images[id]));

    return <Container>
        <Row className="px-4">
            <h3 className="text-center flex-fill">{group.name}</h3>
            <DeleteFavouritesGroupButton variant="white" group={group}/>
        </Row>
        <ImageRack images={images} />
    </Container>
}
