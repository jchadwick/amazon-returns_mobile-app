import { Text, View } from "@/components/Themed";
import { useOrderProducts } from "@/hooks/useOrderProducts";
import { OrderProduct, ReturnLocation, ReturnLocationNames } from "@/model";
import clsx from "clsx";
import { useMemo, useState } from "react";
import { Image, Pressable } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { OrderProductList } from "../../components/OrderProductList";

export default function ReturnsScreen() {
  const [selectedReturn, setSelectedReturn] = useState<OrderProduct | null>(
    null
  );

  const {
    query: { isLoading },
    orderProducts: returns,
    markAsReturned,
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

  return selectedReturn ? (
    <OrderProductView
      orderProduct={selectedReturn}
      onClose={() => setSelectedReturn(null)}
      onReturned={() => markAsReturned(selectedReturn)}
      onPrevious={() => {
        setSelectedReturn(
          returns?.[returns?.indexOf(selectedReturn) - 1 || 0] || null
        );
      }}
      onNext={() => {
        setSelectedReturn(
          returns?.[returns?.indexOf(selectedReturn) + 1 || 0] || null
        );
      }}
      hasNext={
        (returns?.indexOf(selectedReturn) || 0) < (returns?.length || 0) - 1 ||
        false
      }
      hasPrevious={(returns?.indexOf(selectedReturn) || 0) > 0 || false}
    />
  ) : (
    <ReturnsList returns={returns || []} onReturnSelected={setSelectedReturn} />
  );
}

function ReturnsList({
  returns,
  onReturnSelected,
}: {
  returns: OrderProduct[];
  onReturnSelected: (x: OrderProduct) => void;
}) {
  const [selectedLocation, setSelectedLocation] = useState<
    ReturnLocation | "all"
  >();

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

  const returnsForSelectedLocation = useMemo(() => {
    return (
      returns?.filter(
        (x) =>
          !selectedLocation ||
          selectedLocation === "all" ||
          x.return_location === selectedLocation
      ) || []
    );
  }, [returns, selectedLocation]);

  const returnLocationOptions = useMemo(() => {
    return [
      { label: "All Locations", value: "all" },
      ...Object.keys(returnsByLocation).map((x) => ({
        label: `${ReturnLocationNames[x as ReturnLocation]} (${
          returnsByLocation[x].length
        })`,
        value: x as ReturnLocation,
      })),
    ];
  }, [returnsByLocation]);

  const [locationPickerOpen, setLocationPickerOpen] = useState(false);

  const returnLocationCount = Object.keys(returnsByLocation).length;

  return (
    <View
      className="flex flex-col gap-3 grow"
      style={{ backgroundColor: "transparent" }}
    >
      {returnLocationCount === 0 && (
        <Text className="text-2xl">No Returns</Text>
      )}
      {returnLocationCount === 1 && (
        <Text className="ml-2 mt-2 text-2xl">
          {
            ReturnLocationNames[
              Object.keys(returnsByLocation)[0] as ReturnLocation
            ]
          }
        </Text>
      )}
      {returnLocationCount > 1 && (
        <View
          className="flex flex-row gap-3 justify-between"
          style={{ zIndex: 100, elevation: 100 }}
        >
          <DropDownPicker
            placeholder="All Locations"
            open={locationPickerOpen}
            value={selectedLocation!}
            items={returnLocationOptions}
            setOpen={setLocationPickerOpen}
            setValue={setSelectedLocation}
          />
        </View>
      )}
      <OrderProductList
        orders={returnsForSelectedLocation}
        onSelected={onReturnSelected}
      />
    </View>
  );
}

function OrderProductView({
  hasNext,
  hasPrevious,
  orderProduct,
  onClose,
  onPrevious,
  onNext,
  onReturned,
}: {
  hasNext: boolean;
  hasPrevious: boolean;
  orderProduct: OrderProduct;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onReturned: () => void;
}) {
  return (
    <View className="flex flex-col w-full h-full p-2 gap-3">
      <View className="flex flex-row w-full justify-end">
        <Pressable onPress={() => onClose()}>
          <Text>X</Text>
        </Pressable>
      </View>
      <View className="flex flex-row p-4 gap-4 items-center ">
        <Image
          className="size-24 shadow-md"
          source={{ uri: orderProduct.product_image_url }}
        />
        <Text className="text-2xl">{orderProduct.product_name}</Text>
      </View>
      <View className="grow flex flex-col m-5 items-center justify-center gap-3">
        <View className="m-auto text-center">
          <Image
            className="inset-0 aspect-square object-fit"
            source={require("../../assets/images/testQrCode.png")}
          />
        </View>
        <Text className="text-xl">{orderProduct.return_method}</Text>
      </View>
      <View className="flex flex-row h-20 justify-between">
        <View className="w-1/4">
          <NavigationButton disabled={!hasPrevious} onPress={onPrevious}>
            <Text>Prev</Text>
          </NavigationButton>
        </View>
        <View className="w-1/2 h-full p-3">
          <NavigationButton onPress={onReturned}>
            <Text>
              Mark
              <br />
              Returned
            </Text>
          </NavigationButton>
        </View>
        <View className="w-1/4 h-full">
          <NavigationButton disabled={!hasNext} onPress={onNext}>
            <Text>Next</Text>
          </NavigationButton>
        </View>
      </View>
    </View>
  );
}

function NavigationButton({ disabled, onPress, children }: any) {
  return (
    <Pressable
      className={clsx(
        "flex align-middle items-center justify-center text-center rounded-sm p-2 w-full h-full",
        {
          "bg-gray-300": disabled,
          "text-white": !disabled,
          "bg-blue-500": !disabled,
        }
      )}
      disabled={disabled}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
}
