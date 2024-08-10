import { Text, View } from "@/components/Themed";
import { useOrderProducts } from "@/hooks/useOrderProducts";
import { OrderProduct, ReturnLocation, ReturnLocationNames } from "@/model";
import { router } from "expo-router";
import { Fragment, useMemo, useState } from "react";
import { OrderProductList } from "../../components/OrderProductList";
import { Modal } from "react-native";
import ReturnsWizard from "@/components/ReturnsWizard";

export default function ReturnsScreen() {
  const [selectedReturn, setSelectedReturn] = useState<OrderProduct | null>(
    null
  );

  const {
    query: { isLoading },
    orderProducts: returns,
  } = useOrderProducts({
    status: "return_created",
  });

  if (isLoading) {
    return (
      <View className="grow flex flex-col justify-center items-center">
        Loading...
      </View>
    );
  }

  return (
    <>
      <ReturnsList
        returns={returns || []}
        onReturnSelected={setSelectedReturn}
      />
      {selectedReturn && (
        <Modal animationType="slide" visible>
          <ReturnsWizard
            selectedReturn={selectedReturn}
            onClose={() => setSelectedReturn(null)}
          />
        </Modal>
      )}
    </>
  );
}

function ReturnsList({
  returns,
  onReturnSelected,
}: {
  returns: OrderProduct[];
  onReturnSelected: (x: OrderProduct) => void;
}) {
  const returnsByLocation: Record<ReturnLocation, OrderProduct[]> =
    useMemo(() => {
      return (
        (returns || [])?.filter((x) => x.return_location) as (OrderProduct & {
          return_location: string;
        })[]
      ).reduce((acc, x) => {
        if (!acc[x.return_location!]) {
          acc[x.return_location!] = [];
        }
        acc[x.return_location!].push(x);
        return acc;
      }, {} as Record<ReturnLocation, OrderProduct[]>);
    }, [returns]);

  const returnLocationCount = Object.keys(returnsByLocation).length;

  return (
    <View
      className="flex flex-col gap-3 grow"
      style={{ backgroundColor: "transparent" }}
    >
      {returnLocationCount === 0 && (
        <Text className="text-2xl">No Returns</Text>
      )}
      {returnLocationCount > 0 &&
        (Object.keys(returnsByLocation) as ReturnLocation[]).map((location) => (
          <Fragment key={location}>
            <View
              className="ml-2 mt-2 flex flex-row items-center"
              style={{ backgroundColor: "transparent" }}
            >
              <Text className="text-2xl">{ReturnLocationNames[location]}</Text>
              <Text className="ml-2">
                ({returnsByLocation[location].length})
              </Text>
            </View>
            <OrderProductList
              orders={returnsByLocation[location]}
              onSelected={onReturnSelected}
            />
          </Fragment>
        ))}
    </View>
  );
}
