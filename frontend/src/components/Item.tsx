import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import { Item } from "../types";

export default function ItemComponent({ item }: { item: Item }) {
  return (
    <Grid item key={item.id} lg={2}>
      <Card variant="outlined">
        <CardActionArea href={"/item/" + item.id}>
          <CardMedia
            sx={{ height: 200 }}
            image={item.imageUrl}
            title={item.name}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {item.name}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}
