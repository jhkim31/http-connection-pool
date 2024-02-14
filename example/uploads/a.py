i = {}

while True:
  [name, count] = input().split(',')
  name = name.strip()
  count = count.strip()
  try:
    count = int(count)
  except Exception as e:
    print()
  if name == "-1" and count == -1:
    break
  if i.get(name) == None:
    i[name] = count
  else:
    i[name] += count
  

for items in i.items(): 
  if (items[1] != ''):
    print(items[0], ',', items[1])

"안녕"