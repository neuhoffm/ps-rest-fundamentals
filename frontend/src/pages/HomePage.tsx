import { useEffect, useState } from "react";
import IPageProps from "../interfaces/page.interface";
import { Item, itemDTO } from "../types";
import axios from "axios";
import { z } from "zod";
import ItemComponent from "../components/Item";
import {
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";

const HomePage: React.FunctionComponent<IPageProps> = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const url = import.meta.env.VITE_API_BASE_URL + "items";
  useEffect(() => {
    axios
      .get(url)
      .then((response) => {
        setLoading(false);
        setItems(z.array(itemDTO).parse(response.data));
      })
      .catch(() => {
        setLoading(false);
        setItems([]);
      });
  }, []);

  if (loading) {
    return <CircularProgress variant="indeterminate" />;
  } else {
    if (items.length > 0) {
      return (
        <Grid container spacing={1} sx={{ p: 1 }}>
          {items.map((item) => {
            return <ItemComponent item={item} />;
          })}
        </Grid>
      );
    } else {
      return (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h4">
              Unable to load content from {url}
            </Typography>
          </CardContent>
        </Card>
      );
    }
  }
};

export default HomePage;
