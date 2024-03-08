import { useEffect, useState } from "react";
import IPageProps from "../interfaces/page.interface";
import { Item, itemDTO } from "../types";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";

const ItemPage: React.FunctionComponent<IPageProps> = () => {
  const { itemId } = useParams();
  const [item, setItem] = useState<Item | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const url = import.meta.env.VITE_API_BASE_URL + "items/" + itemId;
  useEffect(() => {
    axios
      .get(url)
      .then((response) => {
        setLoading(false);
        setItem(itemDTO.parse(response.data));
      })
      .catch(() => {
        setLoading(false);
        setItem(undefined);
      });
  }, []);

  if (loading) {
    return <CircularProgress variant="indeterminate" />;
  } else {
    if (item != undefined) {
      <Box sx={{ p: 1 }}>
        <h1>{item?.name}</h1>
        <img src={item?.imageUrl} style={{ maxWidth: 1000 }} />
        <p>{item?.description}</p>
      </Box>;
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

export default ItemPage;
