import { Vector3, Camera } from 'three'

// 世界坐标转屏幕坐标
export function worldToStandardHandle(
  camera: Camera,
  { x, y, z }: { x: number; y: number; z: number }
) {
  const worldVector = new Vector3(x, y, z)
  const standardVector = worldVector.project(camera)
  var a = window.innerWidth / 2
  var b = window.innerHeight / 2
  var x1 = Math.round(standardVector.x * a + a)
  var y1 = Math.round(-standardVector.y * b + b)
  return [x1, y1]
}

// 屏幕坐标转世界坐标
export function standardToWorldHandle(
  camera: Camera,
  { x, y }: { x: number; y: number },
  z?: number
) {
  const x1 = (x / window.innerWidth) * 2 - 1
  const y1 = -(y / window.innerHeight) * 2 + 1
  //标准设备坐标(z=0.5这个值并没有一个具体的说法)
  const stdVector = new Vector3(x1, y1, 0.5)
  stdVector.unproject(camera)
  var direction = stdVector.sub(camera.position).normalize()
  var distance = -camera.position.z / direction.z
  var worldCoord = camera.position
    .clone()
    .add(direction.multiplyScalar(distance - (z || 0)))
  return worldCoord
}
