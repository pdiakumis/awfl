task grep_pattern { 
  String pattern
  File file

  command {
    grep '${pattern}' ${file} > results.txt
  }

  output {
    File out = "results.txt"
  }
}

workflow get_greps {
  call grep_pattern
}
