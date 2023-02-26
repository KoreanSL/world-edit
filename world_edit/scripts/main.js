import { world, MinecraftBlockTypes, BlockLocation } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";

const pos = {};

const isBlock = (player, max_distance) => player.getBlockFromViewDirection({ maxDistance: max_distance }) || false;

const ui = (player, pos1, pos2) => {
  new ModalFormData()
  .title("set")
  .textField("block identifier", "type here", "minecraft:")
  .toggle("replace block", true)
  .show(player).then(result => {
    let block = result.formValues[0];
    let blockId = MinecraftBlockTypes.get(block);
    let replaceBlock = result.formValues[1];
    let fillOptions = {
      matchingBlock: MinecraftBlockTypes.air.createDefaultBlockPermutation()
    }
    player.tell(world.getDimension('overworld').fillBlocks(pos1, pos2, blockId, replaceBlock==true ? undefined : fillOptions)+" blocks placed.");
  })
}

world.events.beforeItemUse.subscribe(event => {
  const { source, item } = event;
  const block = isBlock(source, 7);
  if (item.typeId!="minecraft:wooden_axe")return;
  if (block) {
    const turn = pos[source.name]?.turn || 0;
    source.tell(`§dpos${turn + 1}: (${block.x}, ${block.y}, ${block.z})`);
    pos[source.name] = { ...pos[source.name], turn: (turn + 1) % 2, [`pos${turn + 1}`]: block.location };
    turn+1 == 2 ? ui(source, pos[source.name]["pos1"], pos[source.name]["pos2"]) : "";
  }
});

world.events.tick.subscribe(() => {
  for (const player of world.getPlayers()) pos[player.name] ||= { turn: 0, pos1: null, pos2: null };
});
